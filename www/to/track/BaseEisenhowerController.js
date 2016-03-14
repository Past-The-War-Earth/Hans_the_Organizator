///<reference path="../imports.ts"/>
/**
 * Created by artem on 7/4/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to_1) {
    var track;
    (function (track) {
        var QuadrantState = (function () {
            function QuadrantState(urgency, priority) {
                this.urgency = urgency;
                this.priority = priority;
                this.numActions = 0;
                this.numPlanned = 0;
                this.numReady = 0;
                this.numInProgress = 0;
                this.numRecentlyDone = 0;
                this.selected = false;
                this.numActions = 0;
            }
            return QuadrantState;
        }());
        track.QuadrantState = QuadrantState;
        var EisenhowerBaseController = (function (_super) {
            __extends(EisenhowerBaseController, _super);
            function EisenhowerBaseController() {
                _super.apply(this, arguments);
                this.groupSelectionMode = false;
                this.priorityStates = [];
                this.urgencyStates = [];
                this.selectedGroupsState = new QuadrantState(-1, -1);
                this.hasSelectedGroups = false;
            }
            EisenhowerBaseController.prototype.getSelectedUrgencyStyle = function (urgency) {
                var styleObject = {};
                styleObject['background-color'] = '#' + to.common.urgencyColors[urgency];
                if (!this.groupSelectionMode) {
                    return styleObject;
                }
                var state = this.urgencyStates[urgency];
                if (state && state.selected) {
                    styleObject['background-color'] = '#' + to.common.selectedUrgencyColors[urgency];
                    styleObject['border'] = '2px solid #1abc9c';
                }
                return styleObject;
            };
            EisenhowerBaseController.prototype.getSelectedUrgencyLabelClass = function (urgency) {
                var state = this.urgencyStates[urgency];
                return state && state.selected ? 'selected-label' : '';
            };
            EisenhowerBaseController.prototype.getSelectedPriorityStyle = function (priority) {
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
            };
            EisenhowerBaseController.prototype.getSelectedPriorityLabelClass = function (priority) {
                var state = this.priorityStates[4 - priority];
                return state && state.selected ? 'selected-label' : '';
            };
            EisenhowerBaseController.prototype.onPriorityRowClick = function (clickedPriority) {
                this.hasSelectedGroups = false;
                var priorityState = this.priorityStates[4 - clickedPriority];
                if (!this.groupSelectionMode) {
                    priorityState.selected = true;
                    this.groupSelectionMode = true;
                }
                else {
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
                    }
                    else {
                        for (var urgency = 0; urgency <= 4; urgency++) {
                            var urgencySelected = this.urgencyStates[urgency].selected;
                            for (var priority = 0; priority <= 4; priority++) {
                                this.matrixState[urgency][priority].selected = urgencySelected;
                            }
                        }
                    }
                }
                else {
                    for (var urgency = 0; urgency <= 4; urgency++) {
                        this.matrixState[urgency][4 - clickedPriority].selected = priorityState.selected;
                    }
                }
                this.computeSelectedGroupsState(anyUrgencySelected, anyPrioritySelected);
                this.hasSelectedGroups = anyPrioritySelected || anyUrgencySelected;
            };
            EisenhowerBaseController.prototype.onUrgencyColumnClick = function (clickedUrgency) {
                this.hasSelectedGroups = false;
                var urgencyState = this.urgencyStates[clickedUrgency];
                if (!this.groupSelectionMode) {
                    urgencyState.selected = true;
                    this.groupSelectionMode = true;
                }
                else {
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
                    }
                    else {
                        for (var priority = 0; priority <= 4; priority++) {
                            var prioritySelected = this.priorityStates[priority].selected;
                            for (var urgency = 0; urgency <= 4; urgency++) {
                                this.matrixState[urgency][priority].selected = prioritySelected;
                            }
                        }
                    }
                }
                else {
                    for (var priority = 0; priority <= 4; priority++) {
                        this.matrixState[clickedUrgency][priority].selected = urgencyState.selected;
                    }
                }
                this.computeSelectedGroupsState(anyUrgencySelected, anyPrioritySelected);
                this.hasSelectedGroups = anyPrioritySelected || anyUrgencySelected;
            };
            EisenhowerBaseController.prototype.computeSelectedGroupsState = function (anyUrgencySelected, anyPrioritySelected) {
                this.selectedGroupsState = new QuadrantState(-1, 1);
                if (anyUrgencySelected && anyPrioritySelected) {
                    for (var priority = 0; priority <= 4; priority++) {
                        for (var urgency = 0; urgency <= 4; urgency++) {
                            if (this.priorityStates[priority].selected && this.urgencyStates[urgency].selected) {
                                this.addCounts(this.selectedGroupsState, this.matrixState[urgency][priority]);
                            }
                        }
                    }
                }
                else if (anyUrgencySelected) {
                    for (var urgency = 0; urgency <= 4; urgency++) {
                        if (this.urgencyStates[urgency].selected) {
                            this.addCounts(this.selectedGroupsState, this.urgencyStates[urgency]);
                        }
                    }
                }
                else if (anyPrioritySelected) {
                    for (var priority = 0; priority <= 4; priority++) {
                        if (this.priorityStates[priority].selected) {
                            this.addCounts(this.selectedGroupsState, this.priorityStates[priority]);
                        }
                    }
                }
            };
            EisenhowerBaseController.prototype.computeQuadrantStates = function (actions, container) {
                var _this = this;
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
                actions.forEach(function (action) {
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
                            _this.addCounts(urgencyState, container.matrixState[urgency][priority]);
                        }
                        container.urgencyStates[urgency] = urgencyState;
                    }
                    for (var priority = 4; priority >= 0; priority--) {
                        var priorityState = new QuadrantState(0, 4 - priority);
                        for (var urgency = 0; urgency < 5; urgency++) {
                            _this.addCounts(priorityState, container.matrixState[urgency][priority]);
                        }
                        container.priorityStates[priority] = priorityState;
                    }
                });
            };
            EisenhowerBaseController.prototype.addCounts = function (to, from) {
                to.numActions += from.numActions;
                to.numPlanned += from.numPlanned;
                to.numReady += from.numReady;
                to.numInProgress += from.numInProgress;
                to.numRecentlyDone += from.numRecentlyDone;
            };
            EisenhowerBaseController.prototype.getCellSideSize = function () {
                return Math.floor((Math.min(window.innerHeight, window.innerWidth) - 10) / 6);
            };
            return EisenhowerBaseController;
        }(to_1.common.ActionsController));
        track.EisenhowerBaseController = EisenhowerBaseController;
    })(track = to_1.track || (to_1.track = {}));
})(to || (to = {}));
//# sourceMappingURL=BaseEisenhowerController.js.map