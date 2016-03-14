var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var track;
    (function (track) {
        function getEisenhowerInfo(params, icons, body) {
        }
        track.getEisenhowerInfo = getEisenhowerInfo;
        var EisenhowerController = (function (_super) {
            __extends(EisenhowerController, _super);
            function EisenhowerController($ionicActionSheet, $ionicHistory, $ionicViewService, $scope, $state, $stateParams, actionRepository, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'EisenhowerController', 'Track');
                this.$ionicActionSheet = $ionicActionSheet;
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.priorityStates = [];
                this.urgencyStates = [];
                this.selectedGroupsState = new track.QuadrantState(-1, -1);
                this.hasSelectedGroups = false;
                this.kanbanState = this.Kanban.AllIncomplete;
                this.reload();
            }
            EisenhowerController.prototype.reload = function () {
                var _this = this;
                return this.actionRepository.getByParameters("5", "5", this.$stateParams.kanbanState, this.$stateParams.categoryId, this.$stateParams.motivationId).then(function (allActions) {
                    _this.computeQuadrantStates(allActions, _this);
                    _this.computeQuadrantSizes('numActions', 'size');
                    _this.computeQuadrantSizes('numPlanned', 'sizePlanned');
                    _this.computeQuadrantSizes('numReady', 'sizeReady');
                    _this.computeQuadrantSizes('numInProgress', 'sizeInProgress');
                    _this.loaded = true;
                    _this.groupSelectionMode = true;
                    if (_this.$stateParams.urgencies != to.common.Urgency.All) {
                        var urgencies = _this.$stateParams.urgencies.split(',');
                        urgencies.forEach(function (urgency) {
                            _this.onUrgencyColumnClick(parseInt(urgency));
                        });
                    }
                    if (_this.$stateParams.priorities != to.common.Priority.All) {
                        var priorities = _this.$stateParams.priorities.split(',');
                        priorities.forEach(function (priority) {
                            _this.onPriorityRowClick(parseInt(priority));
                        });
                    }
                    _this.afterDataLoad();
                    var cellSideSize = _super.prototype.getCellSideSize.call(_this);
                    jQuery('tr').css('height', cellSideSize + 'px');
                    jQuery('span.quadrant').css('height', cellSideSize + 'px');
                    jQuery('span.quadrant').css('width', cellSideSize + 'px');
                    jQuery('nav.eisenhower-header').css('height', cellSideSize - 15 + 'px');
                    jQuery('nav.eisenhower-header').css('width', cellSideSize - 15 + 'px');
                });
            };
            EisenhowerController.prototype.computeQuadrantSizes = function (countsProperty, sizeProperty) {
                var _this = this;
                var minNumber;
                var maxNumber = 0;
                this.matrixState.forEach(function (priorityRow) {
                    priorityRow.forEach(function (quadrant) {
                        if (!minNumber || (quadrant[countsProperty] && minNumber > quadrant[countsProperty])) {
                            minNumber = quadrant[countsProperty];
                        }
                        if (maxNumber < quadrant[countsProperty]) {
                            maxNumber = quadrant[countsProperty];
                        }
                    });
                });
                var minDisplayDiameter = 1;
                var maxDisplayDiameter = _super.prototype.getCellSideSize.call(this);
                var maxRadius = maxDisplayDiameter / 2;
                var maxArea = to.chart.bubble.PI * maxRadius * maxRadius;
                var areaOfOneAction = maxArea / maxNumber;
                this.matrixState.forEach(function (priorityRow) {
                    priorityRow.forEach(function (quadrant) {
                        quadrant[sizeProperty] = _this.getDiameterOfQuadrant(quadrant, areaOfOneAction, countsProperty);
                        if (quadrant[sizeProperty] < minDisplayDiameter) {
                            quadrant[sizeProperty] = minDisplayDiameter;
                        }
                        if (quadrant[sizeProperty] > maxDisplayDiameter) {
                            quadrant[sizeProperty] = maxDisplayDiameter;
                        }
                    });
                });
            };
            EisenhowerController.prototype.getDiameterOfQuadrant = function (quarant, areaOfOneAction, countsProperty) {
                if (quarant[countsProperty] < 1) {
                    return 0;
                }
                var areaOfQuadrant = areaOfOneAction * quarant[countsProperty];
                var radius = Math.sqrt(areaOfQuadrant / to.chart.bubble.PI);
                return Math.round(radius * 2);
            };
            EisenhowerController.prototype.onQuadrantClick = function (quadrant) {
                this.groupSelectionMode = false;
                this.currentQuadrant = quadrant;
            };
            EisenhowerController.prototype.getParams = function () {
                var params = {};
                if (!this.groupSelectionMode) {
                    params = {
                        urgencies: this.currentQuadrant.urgency,
                        priorities: this.currentQuadrant.priority
                    };
                }
                else {
                    var selectedUrgencies = [];
                    this.urgencyStates.forEach(function (urgencyState) {
                        if (urgencyState.selected) {
                            selectedUrgencies.push(urgencyState.urgency);
                        }
                    });
                    if (selectedUrgencies.length > 0) {
                        params.urgencies = selectedUrgencies.join(',');
                    }
                    var selectedPriorities = [];
                    this.priorityStates.forEach(function (priorityState) {
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
            };
            EisenhowerController.prototype.getSelectedUrgencyLabelClass = function (urgency) {
                if (this.groupSelectionMode) {
                    return _super.prototype.getSelectedUrgencyLabelClass.call(this, urgency);
                }
                return this.currentQuadrant && this.currentQuadrant.urgency == urgency ? 'selected-label' : '';
            };
            EisenhowerController.prototype.getSelectedPriorityLabelClass = function (priority) {
                if (this.groupSelectionMode) {
                    return _super.prototype.getSelectedPriorityLabelClass.call(this, priority);
                }
                return this.currentQuadrant && this.currentQuadrant.priority == priority ? 'selected-label' : '';
            };
            EisenhowerController.prototype.getQuadrantStyle = function (quadrant) {
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
                    }
                }
                else {
                    var isCurrentQuadrant = quadrant === this.currentQuadrant;
                    color = isCurrentQuadrant ? selectedColor : color;
                    if (isCurrentQuadrant) {
                        styleObject['font-weight'] = 'bold';
                        styleObject['border'] = '2px solid #1abc9c';
                        styleObject['line-height'] = size - 2 + 'px';
                    }
                }
                styleObject['background-color'] = '#' + color;
                return styleObject;
            };
            EisenhowerController.prototype.searchActions = function () {
                var params = this.getParams();
                params.kanbanState = to.common.Kanban.Planned;
                this.$state.go(to.common.states.LIST_ACTIONS, params);
            };
            EisenhowerController.prototype.kanbanActions = function () {
                var params = this.getParams();
                delete params.kanbanState;
                this.$state.go(to.common.states.KANBAN, params);
            };
            EisenhowerController.prototype.viewCategories = function () {
                var params = this.getParams();
                delete params.categoryId;
                this.$state.go(to.common.states.CATEGORIES, params);
            };
            EisenhowerController.prototype.viewMotivations = function () {
                var params = this.getParams();
                delete params.motivationId;
                this.$state.go(to.common.states.MOTIVATIONS, params);
            };
            EisenhowerController.prototype.hasSelection = function () {
                if (this.groupSelectionMode) {
                    return this.hasSelectedGroups;
                }
                return !!this.currentQuadrant;
            };
            EisenhowerController.prototype.getQuadrantLabel = function (quadrant) {
                var numActions = this.getSelectedNumActions(quadrant);
                if (numActions > 0) {
                    return numActions;
                }
                return '';
            };
            EisenhowerController.prototype.getRecentlyDoneCount = function () {
                if (this.groupSelectionMode && this.hasSelectedGroups) {
                    return this.selectedGroupsState.numRecentlyDone;
                }
                else if (!this.groupSelectionMode && this.currentQuadrant) {
                    return this.currentQuadrant.numRecentlyDone;
                }
                else {
                    return this.allStates.numRecentlyDone;
                }
            };
            EisenhowerController.prototype.getInProgressCount = function () {
                if (this.groupSelectionMode && this.hasSelectedGroups) {
                    return this.selectedGroupsState.numInProgress;
                }
                else if (!this.groupSelectionMode && this.currentQuadrant) {
                    return this.currentQuadrant.numInProgress;
                }
                else {
                    return this.allStates.numInProgress;
                }
            };
            EisenhowerController.prototype.getReadyCount = function () {
                if (this.groupSelectionMode && this.hasSelectedGroups) {
                    return this.selectedGroupsState.numReady;
                }
                else if (!this.groupSelectionMode && this.currentQuadrant) {
                    return this.currentQuadrant.numReady;
                }
                else {
                    return this.allStates.numReady;
                }
            };
            EisenhowerController.prototype.getPlannedCount = function () {
                if (this.groupSelectionMode && this.hasSelectedGroups) {
                    return this.selectedGroupsState.numPlanned;
                }
                else if (!this.groupSelectionMode && this.currentQuadrant) {
                    return this.currentQuadrant.numPlanned;
                }
                else {
                    return this.allStates.numPlanned;
                }
            };
            EisenhowerController.prototype.selectPlanned = function () {
                if (this.kanbanState == this.Kanban.Planned) {
                    this.kanbanState = this.Kanban.AllIncomplete;
                }
                else {
                    this.kanbanState = this.Kanban.Planned;
                }
            };
            EisenhowerController.prototype.getPlannedButtonClass = function () {
                if (this.kanbanState == this.Kanban.Planned) {
                    return 'background-plan selected-button';
                }
                return '';
            };
            EisenhowerController.prototype.getPlannedLabelClass = function () {
                if (this.kanbanState == this.Kanban.Planned) {
                    return 'selected-label';
                }
                return '';
            };
            EisenhowerController.prototype.selectReady = function () {
                if (this.kanbanState == this.Kanban.Ready) {
                    this.kanbanState = this.Kanban.AllIncomplete;
                }
                else {
                    this.kanbanState = this.Kanban.Ready;
                }
            };
            EisenhowerController.prototype.getReadyButtonClass = function () {
                if (this.kanbanState == this.Kanban.Ready) {
                    return 'background-categories selected-button';
                }
                return '';
            };
            EisenhowerController.prototype.getReadyLabelClass = function () {
                if (this.kanbanState == this.Kanban.Ready) {
                    return 'selected-label';
                }
                return '';
            };
            EisenhowerController.prototype.selectInProgress = function () {
                if (this.kanbanState == this.Kanban.InProgress) {
                    this.kanbanState = this.Kanban.AllIncomplete;
                }
                else {
                    this.kanbanState = this.Kanban.InProgress;
                }
            };
            EisenhowerController.prototype.getInProgressButtonClass = function () {
                if (this.kanbanState == this.Kanban.InProgress) {
                    return 'background-advise selected-button';
                }
                return '';
            };
            EisenhowerController.prototype.getInProgressLabelClass = function () {
                if (this.kanbanState == this.Kanban.InProgress) {
                    return 'selected-label';
                }
                return '';
            };
            EisenhowerController.prototype.getSelectedSize = function (quadrant) {
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
            };
            EisenhowerController.prototype.getSelectedNumActions = function (quadrant) {
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
            };
            EisenhowerController.prototype.bubbleChart = function () {
                this.$state.go(to.common.states.CHART_BUBBLE_CLICKABLE, this.getParams());
            };
            return EisenhowerController;
        })(track.EisenhowerBaseController);
        angular.module('organizator').controller('EisenhowerController', EisenhowerController);
    })(track = to.track || (to.track = {}));
})(to || (to = {}));
//# sourceMappingURL=EisenhowerController.js.map