///<reference path="../imports.ts"/>
/**
 * Created by artem on 7/4/15.
 */

module to.track {

	export class QuadrantState {
		numActions:number = 0;
		numPlanned:number = 0;
		numReady:number = 0;
		numInProgress:number = 0;
		numRecentlyDone:number = 0;
		selected:boolean = false;
		size:number;
		sizePlanned:number;
		sizeReady:number;
		sizeInProgress:number;

		constructor
		(public urgency:number,
		 public priority:number) {
			this.numActions = 0;
		}
	}

	export interface QuadrantContainer {
		matrixState:QuadrantState[][];
		priorityStates:QuadrantState[];
		urgencyStates:QuadrantState[];
		allStates:QuadrantState;
	}

	export class EisenhowerBaseController extends common.ActionsController implements QuadrantContainer, to.common.UnifiedControllerHandler {

		groupSelectionMode:boolean = false;

		matrixState:QuadrantState[][];
		priorityStates:QuadrantState[] = [];
		urgencyStates:QuadrantState[] = [];
		allStates:QuadrantState;
		selectedGroupsState:QuadrantState = new QuadrantState(-1, -1);
		hasSelectedGroups:boolean = false;

		getSelectedUrgencyStyle
		(urgency:number) {
			var styleObject = {};
			styleObject['background-color'] = '#' + to.common.urgencyColors[urgency];
			if(!this.groupSelectionMode) {
				return styleObject;
			}
			var state = this.urgencyStates[urgency];
			if (state && state.selected) {
				styleObject['background-color'] = '#' +  to.common.selectedUrgencyColors[urgency];
				styleObject['border'] = '2px solid #1abc9c'
			}
			return styleObject;
		}

		getSelectedUrgencyLabelClass
		(urgency:number) {
			var state = this.urgencyStates[urgency];
			return state && state.selected ? 'selected-label' : '';
		}

		getSelectedPriorityStyle
		(priority:number) {
			var styleObject = {};
			styleObject['background-color'] = '#' + to.common.priorityColors[4 - priority];
			if (!this.groupSelectionMode) {
				return styleObject;
			}
			var state = this.priorityStates[4 - priority];
			if (state && state.selected) {
				styleObject['background-color'] = '#' + to.common.selectedPriorityColors[4 - priority];
				styleObject['border'] = '2px solid #1abc9c';
			}
			return styleObject;
		}

		getSelectedPriorityLabelClass
		(priority:number) {
			var state = this.priorityStates[4 - priority];
			return state && state.selected ? 'selected-label' : '';
		}

		onPriorityRowClick(clickedPriority:number) {
			this.hasSelectedGroups = false;
			var priorityState = this.priorityStates[4 - clickedPriority];

			if (!this.groupSelectionMode) {
				priorityState.selected = true;
				this.groupSelectionMode = true;
			} else {
				priorityState.selected = !priorityState.selected;
			}

			var anyUrgencySelected = false;
			for (var urgency = 0; urgency <= 4; urgency++) {
				anyUrgencySelected = anyUrgencySelected || this.urgencyStates[urgency].selected;
			}

			var anyPrioritySelected = false;
			for (var priority = 0; priority <= 4; priority++) {
				anyPrioritySelected = anyPrioritySelected || this.priorityStates[priority].selected;
			}

			if (anyUrgencySelected) {
				if (anyPrioritySelected) {
					for (var priority = 0; priority <= 4; priority++) {
						var prioritySelected = this.priorityStates[priority].selected;
						for (var urgency = 0; urgency <= 4; urgency++) {
							var urgencySelected = this.urgencyStates[urgency].selected;
							this.matrixState[urgency][priority].selected = urgencySelected && prioritySelected;
						}
					}
				} else {
					for (var urgency = 0; urgency <= 4; urgency++) {
						var urgencySelected = this.urgencyStates[urgency].selected;
						for (var priority = 0; priority <= 4; priority++) {
							this.matrixState[urgency][priority].selected = urgencySelected;
						}
					}
				}
			} else {
				for (var urgency = 0; urgency <= 4; urgency++) {
					this.matrixState[urgency][4 - clickedPriority].selected = priorityState.selected;
				}
			}
			this.computeSelectedGroupsState(anyUrgencySelected, anyPrioritySelected);
			this.hasSelectedGroups = anyPrioritySelected || anyUrgencySelected;
		}

		onUrgencyColumnClick(clickedUrgency:number) {
			this.hasSelectedGroups = false;
			var urgencyState = this.urgencyStates[clickedUrgency];

			if (!this.groupSelectionMode) {
				urgencyState.selected = true;
				this.groupSelectionMode = true;
			} else {
				urgencyState.selected = !urgencyState.selected;
			}

			var anyPrioritySelected = false;
			for (var priority = 0; priority <= 4; priority++) {
				anyPrioritySelected = anyPrioritySelected || this.priorityStates[priority].selected;
			}

			var anyUrgencySelected = false;
			for (var urgency = 0; urgency <= 4; urgency++) {
				anyUrgencySelected = anyUrgencySelected || this.urgencyStates[urgency].selected;
			}

			if (anyPrioritySelected) {
				if (anyUrgencySelected) {
					for (var urgency = 0; urgency <= 4; urgency++) {
						for (var priority = 0; priority <= 4; priority++) {
							var urgencySelected = this.urgencyStates[urgency].selected;
							var prioritySelected = this.priorityStates[priority].selected;
							this.matrixState[urgency][priority].selected = urgencySelected && prioritySelected;
						}
					}
				} else {
					for (var priority = 0; priority <= 4; priority++) {
						var prioritySelected = this.priorityStates[priority].selected;
						for (var urgency = 0; urgency <= 4; urgency++) {
							this.matrixState[urgency][priority].selected = prioritySelected;
						}
					}
				}
			} else {
				for (var priority = 0; priority <= 4; priority++) {
					this.matrixState[clickedUrgency][priority].selected = urgencyState.selected;
				}
			}
			this.computeSelectedGroupsState(anyUrgencySelected, anyPrioritySelected);
			this.hasSelectedGroups = anyPrioritySelected || anyUrgencySelected;
		}

		computeSelectedGroupsState
		(anyUrgencySelected:boolean,
		 anyPrioritySelected:boolean) {
			this.selectedGroupsState = new QuadrantState(-1, 1);
			if (anyUrgencySelected && anyPrioritySelected) {
				for (var priority = 0; priority <= 4; priority++) {
					for (var urgency = 0; urgency <= 4; urgency++) {
						if (this.priorityStates[priority].selected && this.urgencyStates[urgency].selected) {
							this.addCounts(this.selectedGroupsState, this.matrixState[urgency][priority]);
						}
					}
				}
			} else if (anyUrgencySelected) {
				for (var urgency = 0; urgency <= 4; urgency++) {
					if (this.urgencyStates[urgency].selected) {
						this.addCounts(this.selectedGroupsState, this.urgencyStates[urgency]);
					}
				}
			} else if (anyPrioritySelected) {
				for (var priority = 0; priority <= 4; priority++) {
					if (this.priorityStates[priority].selected) {
						this.addCounts(this.selectedGroupsState, this.priorityStates[priority]);
					}
				}
			}
		}

		computeQuadrantStates(actions:to.model.Action[], container:QuadrantContainer) {
			container.matrixState = [[], [], [], [], []];
			for (var urgency = 0; urgency < 5; urgency++) {
				container.matrixState[urgency] = [];
				for (var priority = 4; priority >= 0; priority--) {
					var quadrant = new QuadrantState(urgency, priority);
					container.matrixState[urgency].push(quadrant);
				}
			}
			container.allStates = new QuadrantState(0, 0);
			container.allStates.numActions = actions.length;
			actions.forEach((action:to.model.Action)=> {
				var quadrantState = container.matrixState[to.common.getUrgencyOfAction(action)][4 - parseInt(action.priority)];
				quadrantState.numActions++;
				switch (parseInt(action.kanbanState)) {
					case to.common.Kanban.Planned:
						container.allStates.numPlanned++;
						quadrantState.numPlanned++;
						break;
					case to.common.Kanban.Ready:
						container.allStates.numReady++;
						quadrantState.numReady++;
						break;
					case to.common.Kanban.InProgress:
						container.allStates.numInProgress++;
						quadrantState.numInProgress++;
						break;
					case to.common.Kanban.RecentlyDone:
						container.allStates.numRecentlyDone++;
						quadrantState.numRecentlyDone++;
						break;
				}
				for (var urgency = 0; urgency < 5; urgency++) {
					var urgencyState = new QuadrantState(urgency, 0);
					for (var priority = 4; priority >= 0; priority--) {
						this.addCounts(urgencyState, container.matrixState[urgency][priority]);
					}
					container.urgencyStates[urgency] = urgencyState;
				}
				for (var priority = 4; priority >= 0; priority--) {
					var priorityState = new QuadrantState(0, 4 - priority);
					for (var urgency = 0; urgency < 5; urgency++) {
						this.addCounts(priorityState, container.matrixState[urgency][priority]);
					}
					container.priorityStates[priority] = priorityState;
				}
			});
		}

		addCounts
		(to:QuadrantState,
		 from:QuadrantState) {
			to.numActions += from.numActions;
			to.numPlanned += from.numPlanned;
			to.numReady += from.numReady;
			to.numInProgress += from.numInProgress;
			to.numRecentlyDone += from.numRecentlyDone;
		}

		getCellSideSize():number {
			return  Math.floor((Math.min(window.innerHeight, window.innerWidth) - 10) / 6);
		}

	}

}
