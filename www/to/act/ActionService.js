///<reference path="../imports.ts"/>
/**
 * Created by artem on 5/15/15.
 */
var to;
(function (to) {
    var act;
    (function (act) {
        var ActionService = (function () {
            function ActionService(actionRepository, categoryRepository, motivationRepository) {
                this.actionRepository = actionRepository;
                this.categoryRepository = categoryRepository;
                this.motivationRepository = motivationRepository;
                //setTimeout(()=> {
                //	this.upgrade();
                //}, 3000);
            }
            ActionService.prototype.upgrade = function () {
                var _this = this;
                this.categoryRepository.getAll().then(function (categories) {
                    categories.forEach(function (category) {
                        category.numReadyActions = 0;
                        category.numInProgressActions = 0;
                        _this.categoryRepository.update(category);
                    });
                });
                this.motivationRepository.getAll().then(function (motivations) {
                    motivations.forEach(function (motivation) {
                        motivation.numReadyActions = 0;
                        motivation.numInProgressActions = 0;
                        _this.motivationRepository.update(motivation);
                    });
                });
            };
            ActionService.prototype.readyAction = function (action) {
                return this.changeKanbanState(action, 1);
            };
            ActionService.prototype.updateCounts = function (action, plannedCountDelta, readyCountDelta, inProgressCountDelta, completeCountDelta) {
                var _this = this;
                action.motivationIds.forEach(function (motivationId) {
                    _this.motivationRepository.get(motivationId).then(function (motivation) {
                        motivation.numCompleteActions += completeCountDelta;
                        motivation.numInProgressActions += inProgressCountDelta;
                        motivation.numReadyActions += readyCountDelta;
                        motivation.numPlannedActions += plannedCountDelta;
                        _this.motivationRepository.update(motivation);
                    });
                });
                action.categoryIds.forEach(function (categoryId) {
                    _this.categoryRepository.get(categoryId).then(function (category) {
                        category.numCompleteActions += completeCountDelta;
                        category.numInProgressActions += inProgressCountDelta;
                        category.numReadyActions += readyCountDelta;
                        category.numPlannedActions += plannedCountDelta;
                        _this.categoryRepository.update(category);
                    });
                });
            };
            ActionService.prototype.decreaseNumMoves = function (numMoves) {
                if (numMoves < 0) {
                    return ++numMoves;
                }
                else if (numMoves > 0) {
                    return --numMoves;
                }
                return 0;
            };
            ActionService.prototype.changeKanbanState = function (action, moves, originalCall, originalState, isBackMove) {
                if (originalCall === void 0) { originalCall = true; }
                if (originalState === void 0) { originalState = parseInt(action.kanbanState); }
                if (isBackMove === void 0) { isBackMove = (moves > 0); }
                if (moves == 0) {
                    var today = to.common.getStartOfDayDate();
                    switch (action.kanbanState) {
                        case to.common.Kanban.Planned:
                            action.plannedDate = today;
                            break;
                        case to.common.Kanban.Ready:
                            if (!action.originalReadyDate) {
                                action.originalReadyDate = today;
                            }
                            action.readyDate = today;
                            break;
                        case to.common.Kanban.InProgress:
                            if (!action.originalStartDate) {
                                action.originalStartDate = today;
                            }
                            action.startDate = today;
                            break;
                        case to.common.Kanban.RecentlyDone:
                            if (!action.originalDoneDate) {
                                action.originalDoneDate = today;
                            }
                            action.doneDate = today;
                            break;
                    }
                    var lastState = action.states[action.states.length - 1];
                    var numDaysInLastState = to.common.getNumDaysSinceDate(lastState.fromDate);
                    lastState.numDays = numDaysInLastState;
                    var state = {
                        number: action.states.length + 1,
                        fromDate: today,
                        state: action.kanbanState
                    };
                    action.states.push(state);
                    action.kanbanState = action.kanbanState.toString();
                    return this.actionRepository.update(action);
                }
                if (originalCall && moves < 0) {
                    action.numBackMoves++;
                }
                action.kanbanState = parseInt(action.kanbanState);
                var oldState = action.kanbanState;
                action.kanbanState += (moves > 0) ? 1 : -1;
                switch (oldState) {
                    case to.common.Kanban.Planned:
                        this.updateCounts(action, -1, 1, 0, 0);
                        if (originalCall) {
                            action.lastNumDaysInPlanning = to.common.getNumDaysSinceDate(action.plannedDate);
                            action.numDaysInPlanning += to.common.getNumDaysSinceDate(action.plannedDate);
                        }
                        break;
                    case to.common.Kanban.Ready:
                        if (moves > 0) {
                            this.updateCounts(action, 0, -1, 1, 0);
                        }
                        else {
                            this.updateCounts(action, 1, -1, 0, 0);
                        }
                        if (originalCall) {
                            action.lastNumDaysInReady = to.common.getNumDaysSinceDate(action.readyDate);
                            action.numDaysInReady += to.common.getNumDaysSinceDate(action.readyDate);
                        }
                        break;
                    case to.common.Kanban.InProgress:
                        if (moves > 0) {
                            this.updateCounts(action, 0, 0, -1, 1);
                        }
                        else {
                            this.updateCounts(action, 0, 1, -1, 0);
                        }
                        if (originalCall) {
                            action.lastNumDaysInProgress = to.common.getNumDaysSinceDate(action.startDate);
                            action.numDaysInProgress += to.common.getNumDaysSinceDate(action.startDate);
                        }
                        break;
                    case to.common.Kanban.RecentlyDone:
                        if (moves < 0) {
                            this.updateCounts(action, 0, 0, 1, -1);
                        }
                        break;
                }
                return this.changeKanbanState(action, this.decreaseNumMoves(moves), false, originalState, isBackMove);
            };
            ActionService.prototype.addCategory = function (action, category) {
                action.categoryIds.push(category._id);
                switch (parseInt(action.kanbanState)) {
                    case to.common.Kanban.Planned:
                        category.numPlannedActions++;
                        break;
                    case to.common.Kanban.Ready:
                        category.numReadyActions++;
                        break;
                    case to.common.Kanban.InProgress:
                        category.numInProgressActions++;
                        break;
                    case to.common.Kanban.RecentlyDone:
                        category.numCompleteActions++;
                        break;
                }
                this.categoryRepository.update(category);
                this.actionRepository.update(action);
            };
            ActionService.prototype.removeCategory = function (action, category) {
                for (var i = 0; i < action.categoryIds.length; i++) {
                    if (action.categoryIds[i] == category._id) {
                        action.categoryIds.splice(i, 1);
                    }
                }
                switch (parseInt(action.kanbanState)) {
                    case to.common.Kanban.Planned:
                        category.numPlannedActions--;
                        break;
                    case to.common.Kanban.Ready:
                        category.numReadyActions--;
                        break;
                    case to.common.Kanban.InProgress:
                        category.numInProgressActions--;
                        break;
                    case to.common.Kanban.RecentlyDone:
                        category.numCompleteActions--;
                        break;
                }
                this.categoryRepository.update(category);
                this.actionRepository.update(action);
            };
            ActionService.prototype.addMotivation = function (action, motivation) {
                action.motivationIds.push(motivation._id);
                switch (parseInt(action.kanbanState)) {
                    case to.common.Kanban.Planned:
                        motivation.numPlannedActions++;
                        break;
                    case to.common.Kanban.Ready:
                        motivation.numReadyActions++;
                        break;
                    case to.common.Kanban.InProgress:
                        motivation.numInProgressActions++;
                        break;
                    case to.common.Kanban.RecentlyDone:
                        motivation.numCompleteActions++;
                        break;
                }
                this.motivationRepository.update(motivation);
                this.actionRepository.update(action);
            };
            ActionService.prototype.addBeforeAction = function (toAction, beforeAction) {
                var _this = this;
                toAction.beforeActionIds = toAction.beforeActionIds ? toAction.beforeActionIds : [];
                beforeAction.afterActionIds = beforeAction.afterActionIds ? beforeAction.afterActionIds : [];
                toAction.beforeActionIds.push(beforeAction._id);
                beforeAction.afterActionIds.push(toAction._id);
                return this.actionRepository.update(toAction).then(function () {
                    return _this.actionRepository.update(beforeAction);
                });
            };
            ActionService.prototype.removeBeforeAction = function (fromAction, beforeAction) {
                var _this = this;
                var beforeActionIdIndex = fromAction.beforeActionIds.indexOf(beforeAction._id);
                if (beforeActionIdIndex >= 0) {
                    fromAction.beforeActionIds.splice(beforeActionIdIndex, 1);
                }
                var afterActionIdIndex = beforeAction.afterActionIds.indexOf(fromAction._id);
                if (afterActionIdIndex >= 0) {
                    beforeAction.afterActionIds.splice(afterActionIdIndex, 1);
                }
                return this.actionRepository.update(beforeAction).then(function () {
                    return _this.actionRepository.update(fromAction);
                });
            };
            ActionService.prototype.getCandidatesForBeforeAction = function (targetAction, matchCategories, matchMotivations, matchAdvice) {
                var _this = this;
                if (matchCategories === void 0) { matchCategories = false; }
                if (matchMotivations === void 0) { matchMotivations = false; }
                if (matchAdvice === void 0) { matchAdvice = false; }
                var targetMotivationsById = {};
                var motivationIds = targetAction.motivationIds ? targetAction.motivationIds : [];
                motivationIds.forEach(function (motivationId) {
                    targetMotivationsById[motivationId] = true;
                });
                var targetCategoriesById = {};
                var categoryIds = targetAction.categoryIds ? targetAction.categoryIds : [];
                categoryIds.forEach(function (categoryId) {
                    targetCategoriesById[categoryId] = true;
                });
                var targetAdviceById = {};
                var adviceIds = targetAction.adviceIds ? targetAction.adviceIds : [];
                adviceIds.forEach(function (adviceId) {
                    targetAdviceById[adviceId] = true;
                });
                return this.actionRepository.getMap().then(function (actionMap) {
                    if (targetAction.kanbanState == to.common.Kanban.RecentlyDone) {
                        return [];
                    }
                    var candidatesForBeforeAction = [];
                    for (var id in actionMap) {
                        if (id === targetAction._id) {
                            continue;
                        }
                        var candidateAction = actionMap[id];
                        if (targetAction.kanbanState < candidateAction.kanbanState) {
                            continue;
                        }
                        if (targetAction.kanbanState != to.common.Kanban.Planned
                            && targetAction.kanbanState == candidateAction.kanbanState) {
                            continue;
                        }
                        if (_this.isOnBeforePath(targetAction, id, actionMap)) {
                            continue;
                        }
                        if (matchCategories && categoryIds.length > 0) {
                            var hasAMatchingCategory = candidateAction.categoryIds.some(function (categoryId) {
                                if (targetCategoriesById[categoryId]) {
                                    return true;
                                }
                            });
                            if (!hasAMatchingCategory) {
                                continue;
                            }
                        }
                        if (matchMotivations && motivationIds.length > 0) {
                            var hasAMatchingMotivation = candidateAction.motivationIds.some(function (motivationId) {
                                if (targetMotivationsById[motivationId]) {
                                    return true;
                                }
                            });
                            if (!hasAMatchingMotivation) {
                                continue;
                            }
                        }
                        if (matchAdvice && adviceIds.length > 0) {
                            var hasMatchingAdvice = candidateAction.adviceIds.some(function (adviceId) {
                                if (targetAdviceById[adviceId]) {
                                    return true;
                                }
                            });
                            if (!hasMatchingAdvice) {
                                continue;
                            }
                        }
                        candidatesForBeforeAction.push(candidateAction);
                    }
                    return candidatesForBeforeAction;
                });
            };
            ActionService.prototype.isOnBeforePath = function (targetAction, candiateForBeforeActionId, actionMap) {
                var _this = this;
                var candidateAction = actionMap[candiateForBeforeActionId];
                var beforeActionIds = targetAction.beforeActionIds ? targetAction.beforeActionIds : [];
                var isOnBeforePath = beforeActionIds.some(function (beforeActionId) {
                    if (candiateForBeforeActionId == beforeActionId) {
                        return true;
                    }
                    var beforeAction = actionMap[beforeActionId];
                    if (_this.isOnBeforePath(beforeAction, candiateForBeforeActionId, actionMap)) {
                        return true;
                    }
                });
                return isOnBeforePath;
            };
            ActionService.prototype.addAfterAction = function (toAction, afterAction) {
                var _this = this;
                toAction.afterActionIds = toAction.afterActionIds ? toAction.afterActionIds : [];
                toAction.afterActionIds.push(afterAction._id);
                afterAction.beforeActionIds = afterAction.beforeActionIds ? afterAction.beforeActionIds : [];
                afterAction.beforeActionIds.push(toAction._id);
                return this.actionRepository.update(toAction).then(function () {
                    return _this.actionRepository.update(afterAction);
                });
            };
            ActionService.prototype.removeAfterAction = function (fromAction, afterAction) {
                var _this = this;
                var afterActionIdIndex = fromAction.afterActionIds.indexOf(afterAction._id);
                if (afterActionIdIndex >= 0) {
                    fromAction.afterActionIds.splice(afterActionIdIndex, 1);
                }
                var beforeActionIdIndex = afterAction.beforeActionIds.indexOf(fromAction._id);
                if (beforeActionIdIndex >= 0) {
                    afterAction.beforeActionIds.splice(beforeActionIdIndex, 1);
                }
                return this.actionRepository.update(afterAction).then(function () {
                    return _this.actionRepository.update(fromAction);
                });
            };
            ActionService.prototype.getCandidatesForAfterAction = function (targetAction, matchCategories, matchMotivations, matchAdvice) {
                var _this = this;
                if (matchCategories === void 0) { matchCategories = false; }
                if (matchMotivations === void 0) { matchMotivations = false; }
                if (matchAdvice === void 0) { matchAdvice = false; }
                var targetMotivationsById = {};
                var motivationIds = targetAction.motivationIds ? targetAction.motivationIds : [];
                motivationIds.forEach(function (motivationId) {
                    targetMotivationsById[motivationId] = true;
                });
                var targetCategoriesById = {};
                var categoryIds = targetAction.categoryIds ? targetAction.categoryIds : [];
                categoryIds.forEach(function (categoryId) {
                    targetCategoriesById[categoryId] = true;
                });
                var targetAdviceById = {};
                var adviceIds = targetAction.adviceIds ? targetAction.adviceIds : [];
                adviceIds.forEach(function (adviceId) {
                    targetAdviceById[adviceId] = true;
                });
                return this.actionRepository.getMap().then(function (actionMap) {
                    if (targetAction.kanbanState == to.common.Kanban.RecentlyDone
                        || targetAction.kanbanState == to.common.Kanban.InProgress) {
                        return [];
                    }
                    var candidatesForAfterAction = [];
                    for (var id in actionMap) {
                        if (id === targetAction._id) {
                            continue;
                        }
                        var candidateAction = actionMap[id];
                        if (targetAction.kanbanState > candidateAction.kanbanState) {
                            continue;
                        }
                        if (targetAction.kanbanState != to.common.Kanban.Planned
                            && targetAction.kanbanState == candidateAction.kanbanState) {
                            continue;
                        }
                        if (_this.isOnAfterPath(targetAction, id, actionMap)) {
                            continue;
                        }
                        if (matchCategories && categoryIds.length > 0) {
                            var hasAMatchingCategory = candidateAction.categoryIds.some(function (categoryId) {
                                if (targetCategoriesById[categoryId]) {
                                    return true;
                                }
                            });
                            if (!hasAMatchingCategory) {
                                continue;
                            }
                        }
                        if (matchMotivations && motivationIds.length > 0) {
                            var hasAMatchingMotivation = candidateAction.motivationIds.some(function (motivationId) {
                                if (targetMotivationsById[motivationId]) {
                                    return true;
                                }
                            });
                            if (!hasAMatchingMotivation) {
                                continue;
                            }
                        }
                        if (matchAdvice && adviceIds.length > 0) {
                            var hasMatchingAdvice = candidateAction.adviceIds.some(function (adviceId) {
                                if (targetAdviceById[adviceId]) {
                                    return true;
                                }
                            });
                            if (!hasMatchingAdvice) {
                                continue;
                            }
                        }
                        candidatesForAfterAction.push(candidateAction);
                    }
                    return candidatesForAfterAction;
                });
            };
            ActionService.prototype.isOnAfterPath = function (targetAction, candidateForAfterActionId, actionMap) {
                var _this = this;
                var candidateAction = actionMap[candidateForAfterActionId];
                var afterActionIds = targetAction.afterActionIds ? targetAction.afterActionIds : [];
                var isOnAfterPath = afterActionIds.some(function (afterActionId) {
                    if (candidateForAfterActionId == afterActionId) {
                        return true;
                    }
                    var beforeAction = actionMap[afterActionId];
                    if (_this.isOnAfterPath(beforeAction, candidateForAfterActionId, actionMap)) {
                        return true;
                    }
                });
                return isOnAfterPath;
            };
            ActionService.prototype.removeMotivation = function (action, motivation) {
                for (var i = 0; i < action.motivationIds.length; i++) {
                    if (action.motivationIds[i] == motivation._id) {
                        action.motivationIds.splice(i, 1);
                    }
                }
                switch (parseInt(action.kanbanState)) {
                    case to.common.Kanban.Planned:
                        motivation.numPlannedActions--;
                        break;
                    case to.common.Kanban.Ready:
                        motivation.numReadyActions--;
                        break;
                    case to.common.Kanban.InProgress:
                        motivation.numInProgressActions--;
                        break;
                    case to.common.Kanban.RecentlyDone:
                        motivation.numCompleteActions--;
                        break;
                }
                this.motivationRepository.update(motivation);
                this.actionRepository.update(action);
            };
            return ActionService;
        }());
        act.ActionService = ActionService;
        angular.module('organizator').service('actionService', ActionService);
    })(act = to.act || (to.act = {}));
})(to || (to = {}));
//# sourceMappingURL=ActionService.js.map