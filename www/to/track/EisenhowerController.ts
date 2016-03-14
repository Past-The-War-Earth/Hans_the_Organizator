///<reference path="../imports.ts"/>
/**
 * Created by artem on 4/11/15.
 *
 * Within Eisenhower urgencies and priorities are ranked 0 - 4
 */

module to.track {


	export function getEisenhowerInfo
	(params, icons, body) {

	}

	class EisenhowerController extends EisenhowerBaseController implements QuadrantContainer {

		matrixState:QuadrantState[][];

		priorityStates:QuadrantState[] = [];
		urgencyStates:QuadrantState[] = [];
		allStates:QuadrantState;
		selectedGroupsState:QuadrantState = new QuadrantState(-1, -1);
		hasSelectedGroups:boolean = false;

		kanbanState = this.Kanban.AllIncomplete;

		loaded:boolean;
		currentQuadrant:QuadrantState;

		constructor
		(private $ionicActionSheet,
		 $ionicHistory,
		 $ionicViewService,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private $stateParams,
		 private actionRepository:to.storage.ActionRepository,
		 categoryRepository:to.storage.CategoryRepository,
		 motivationRepository:to.storage.MotivationRepository) {
			super($ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'EisenhowerController', 'Track');
			//$ionicViewService.clearHistory();
			this.reload();
		}

		reload():Promise<any> {
			return this.actionRepository.getByParameters("5", "5", this.$stateParams.kanbanState, this.$stateParams.categoryId, this.$stateParams.motivationId).then((allActions)=> {
				this.computeQuadrantStates(allActions, this);
				this.computeQuadrantSizes('numActions', 'size');
				this.computeQuadrantSizes('numPlanned', 'sizePlanned');
				this.computeQuadrantSizes('numReady', 'sizeReady');
				this.computeQuadrantSizes('numInProgress', 'sizeInProgress');
				this.loaded = true;

				this.groupSelectionMode = true;
				if (this.$stateParams.urgencies != to.common.Urgency.All) {
					var urgencies = this.$stateParams.urgencies.split(',');
					urgencies.forEach((urgency)=> {
						this.onUrgencyColumnClick(parseInt(urgency));
					})
				}
				if (this.$stateParams.priorities != to.common.Priority.All) {
					var priorities = this.$stateParams.priorities.split(',');
					priorities.forEach((priority)=> {
						this.onPriorityRowClick(parseInt(priority));
					})
				}
				this.afterDataLoad();
				var cellSideSize = super.getCellSideSize();
				jQuery('tr').css('height', cellSideSize + 'px');
				jQuery('span.quadrant').css('height', cellSideSize + 'px');
				jQuery('span.quadrant').css('width', cellSideSize + 'px');
				jQuery('nav.eisenhower-header').css('height', cellSideSize - 15 + 'px');
				jQuery('nav.eisenhower-header').css('width', cellSideSize - 15 + 'px');
			});
		}

		computeQuadrantSizes(countsProperty, sizeProperty) {
			var minNumber;
			var maxNumber = 0;
			this.matrixState.forEach((priorityRow)=> {
				priorityRow.forEach((quadrant)=> {
					if (!minNumber || (quadrant[countsProperty] && minNumber > quadrant[countsProperty])) {
						minNumber = quadrant[countsProperty];
					}
					if (maxNumber < quadrant[countsProperty]) {
						maxNumber = quadrant[countsProperty];
					}
				});
			});

			var minDisplayDiameter = 1;
			var maxDisplayDiameter = super.getCellSideSize();

			var maxRadius = maxDisplayDiameter / 2;
			var maxArea = to.chart.bubble.PI * maxRadius * maxRadius;
			var areaOfOneAction = maxArea / maxNumber;

			this.matrixState.forEach((priorityRow)=> {
				priorityRow.forEach((quadrant)=> {
					quadrant[sizeProperty] = this.getDiameterOfQuadrant(quadrant, areaOfOneAction, countsProperty);
					if (quadrant[sizeProperty] < minDisplayDiameter) {
						quadrant[sizeProperty] = minDisplayDiameter;
					}
					if (quadrant[sizeProperty] > maxDisplayDiameter) {
						quadrant[sizeProperty] = maxDisplayDiameter;
					}
				});
			});
		}

		getDiameterOfQuadrant(quarant:QuadrantState, areaOfOneAction:number, countsProperty):number {
			if (quarant[countsProperty] < 1) {
				return 0;
			}
			var areaOfQuadrant = areaOfOneAction * quarant[countsProperty];
			var radius = Math.sqrt(areaOfQuadrant / to.chart.bubble.PI);
			return Math.round(radius * 2);
		}

		onQuadrantClick(quadrant:QuadrantState) {
			this.groupSelectionMode = false;
			this.currentQuadrant = quadrant;
		}

		getParams() {
			var params:any = {};
			if (!this.groupSelectionMode) {
				params = {
					urgencies: this.currentQuadrant.urgency,
					priorities: this.currentQuadrant.priority
				};
			} else {
				var selectedUrgencies = [];
				this.urgencyStates.forEach((urgencyState:QuadrantState) => {
					if (urgencyState.selected) {
						selectedUrgencies.push(urgencyState.urgency);
					}
				});
				if (selectedUrgencies.length > 0) {
					params.urgencies = selectedUrgencies.join(',');
				}
				var selectedPriorities = [];
				this.priorityStates.forEach((priorityState:QuadrantState) => {
					if (priorityState.selected) {
						selectedPriorities.push(priorityState.priority);
					}
				});
				if (selectedPriorities.length > 0) {
					params.priorities = selectedPriorities.join(',');
				}
			}

			params.kanbanState = this.kanbanState;
			params.categoryId = this.$stateParams.categoryId;
			params.motivationId = this.$stateParams.motivationId;

			return params;
		}

		getSelectedUrgencyLabelClass
		(urgency:number) {
			if (this.groupSelectionMode) {
				return super.getSelectedUrgencyLabelClass(urgency);
			}
			return this.currentQuadrant && this.currentQuadrant.urgency == urgency ? 'selected-label' : '';
		}

		getSelectedPriorityLabelClass
		(priority:number) {
			if (this.groupSelectionMode) {
				return super.getSelectedPriorityLabelClass(priority);
			}
			return this.currentQuadrant && this.currentQuadrant.priority == priority ? 'selected-label' : '';
		}

		getQuadrantStyle
		(quadrant:QuadrantState):any {
			var styleObject = {};
			if (!this.getSelectedNumActions(quadrant)) {
				return styleObject;
			}
			var color = to.common.matrixColors[quadrant.urgency][4 - quadrant.priority];
			var selectedColor = to.common.selectedMatrixColors[quadrant.urgency][4 - quadrant.priority];

			var size = this.getSelectedSize(quadrant);
			styleObject['width'] = size;
			styleObject['height'] = size;
			styleObject['line-height'] = size + 'px';
			if (this.groupSelectionMode) {
				var selected = this.matrixState[quadrant.urgency][4 - quadrant.priority].selected;
				color = selected ? selectedColor : color;
				if (selected) {
					styleObject['font-weight'] = 'bold';
					styleObject['border'] = '2px solid #1abc9c';
					styleObject['line-height'] = size - 2 + 'px';
					//styleObject['padding-top'] = '17px';
				}
			} else {
				var isCurrentQuadrant = quadrant === this.currentQuadrant;
				color = isCurrentQuadrant ? selectedColor : color;
				if (isCurrentQuadrant) {
					styleObject['font-weight'] = 'bold';
					styleObject['border'] = '2px solid #1abc9c';
					styleObject['line-height'] = size - 2 + 'px';
					//styleObject['padding-top'] = '17px';
				}
			}
			styleObject['background-color'] = '#' + color;
			return styleObject;
		}

		searchActions() {
			var params = this.getParams();
			params.kanbanState = to.common.Kanban.Planned;

			this.$state.go(to.common.states.LIST_ACTIONS, params);
		}

		kanbanActions() {
			var params = this.getParams();
			delete params.kanbanState;

			this.$state.go(to.common.states.KANBAN, params);
		}

		viewCategories() {
			var params = this.getParams();
			delete params.categoryId;

			this.$state.go(to.common.states.CATEGORIES, params);
		}

		viewMotivations() {
			var params = this.getParams();
			delete params.motivationId;

			this.$state.go(to.common.states.MOTIVATIONS, params);
		}

		hasSelection():boolean {
			if (this.groupSelectionMode) {
				return this.hasSelectedGroups;
			}
			return !!this.currentQuadrant;
		}

		getQuadrantLabel(quadrant:QuadrantState):any {
			var numActions = this.getSelectedNumActions(quadrant);
			if (numActions > 0) {
				return numActions;
			}
			return '';
		}

		getRecentlyDoneCount() {
			if (this.groupSelectionMode && this.hasSelectedGroups) {
				return this.selectedGroupsState.numRecentlyDone;
			} else if (!this.groupSelectionMode && this.currentQuadrant) {
				return this.currentQuadrant.numRecentlyDone;
			} else {
				return this.allStates.numRecentlyDone;
			}
		}

		getInProgressCount() {
			if (this.groupSelectionMode && this.hasSelectedGroups) {
				return this.selectedGroupsState.numInProgress;
			} else if (!this.groupSelectionMode && this.currentQuadrant) {
				return this.currentQuadrant.numInProgress;
			} else {
				return this.allStates.numInProgress;
			}
		}

		getReadyCount() {
			if (this.groupSelectionMode && this.hasSelectedGroups) {
				return this.selectedGroupsState.numReady;
			} else if (!this.groupSelectionMode && this.currentQuadrant) {
				return this.currentQuadrant.numReady;
			} else {
				return this.allStates.numReady;
			}
		}

		getPlannedCount() {
			if (this.groupSelectionMode && this.hasSelectedGroups) {
				return this.selectedGroupsState.numPlanned;
			} else if (!this.groupSelectionMode && this.currentQuadrant) {
				return this.currentQuadrant.numPlanned;
			} else {
				return this.allStates.numPlanned;
			}
		}

		selectPlanned() {
			if (this.kanbanState == this.Kanban.Planned) {
				this.kanbanState = this.Kanban.AllIncomplete;
			} else {
				this.kanbanState = this.Kanban.Planned;
			}
		}

		getPlannedButtonClass() {
			if (this.kanbanState == this.Kanban.Planned) {
				return 'background-plan selected-button';
			}
			return '';
		}

		getPlannedLabelClass() {
			if (this.kanbanState == this.Kanban.Planned) {
				return 'selected-label';
			}
			return '';
		}

		selectReady() {
			if (this.kanbanState == this.Kanban.Ready) {
				this.kanbanState = this.Kanban.AllIncomplete;
			} else {
				this.kanbanState = this.Kanban.Ready;
			}
		}

		getReadyButtonClass() {
			if (this.kanbanState == this.Kanban.Ready) {
				return 'background-categories selected-button';
			}
			return '';
		}

		getReadyLabelClass() {
			if (this.kanbanState == this.Kanban.Ready) {
				return 'selected-label';
			}
			return '';
		}

		selectInProgress() {
			if (this.kanbanState == this.Kanban.InProgress) {
				this.kanbanState = this.Kanban.AllIncomplete;
			} else {
				this.kanbanState = this.Kanban.InProgress;
			}
		}

		getInProgressButtonClass() {
			if (this.kanbanState == this.Kanban.InProgress) {
				return 'background-advise selected-button';
			}
			return '';
		}

		getInProgressLabelClass() {
			if (this.kanbanState == this.Kanban.InProgress) {
				return 'selected-label';
			}
			return '';
		}

		getSelectedSize(quadrant:QuadrantState) {
			switch (this.kanbanState) {
				case this.Kanban.Planned:
					return quadrant.sizePlanned;
				case this.Kanban.Ready:
					return quadrant.sizeReady;
				case this.Kanban.InProgress:
					return quadrant.sizeInProgress;
				case this.Kanban.AllIncomplete:
					return quadrant.size;
			}
		}

		getSelectedNumActions(quadrant:QuadrantState) {
			switch (this.kanbanState) {
				case this.Kanban.Planned:
					return quadrant.numPlanned;
				case this.Kanban.Ready:
					return quadrant.numReady;
				case this.Kanban.InProgress:
					return quadrant.numInProgress;
				case this.Kanban.AllIncomplete:
					return quadrant.numActions;
			}
		}

		bubbleChart() {
			this.$state.go(to.common.states.CHART_BUBBLE_CLICKABLE, this.getParams());
		}

	}

	angular.module('organizator').controller('EisenhowerController', EisenhowerController);
}
