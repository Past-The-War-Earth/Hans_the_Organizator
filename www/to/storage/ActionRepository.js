///<reference path="../imports.ts"/>
/**
 * Created by artem on 3/27/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var storage;
    (function (storage) {
        var NEW_ACTION_ID = '0';
        var ActionRepository = (function (_super) {
            __extends(ActionRepository, _super);
            function ActionRepository($ionicPopup, pouchDB) {
                _super.call(this, $ionicPopup, 'action_', pouchDB);
                this.archive = pouchDB('archive');
                this.setBrandNewAction();
            }
            ActionRepository.prototype.getBrandNewAction = function () {
                return this.newAction;
            };
            ActionRepository.prototype.copyActionToNew = function (action) {
                this.newAction = this.copyAction(action);
            };
            ActionRepository.prototype.copyAction = function (action) {
                var newAction = this.getBrandNewAction();
                newAction.categoryIds = action.categoryIds.slice();
                newAction.estimationBased = action.estimationBased;
                newAction.motivationIds = action.motivationIds.slice();
                newAction.phrase = action.phrase;
                newAction.priority = action.priority;
                newAction.verbBased = action.verbBased;
                return newAction;
            };
            ActionRepository.prototype.setBrandNewAction = function () {
                this.newAction = this.getNewAction();
            };
            ActionRepository.prototype.getNewAction = function () {
                var today = to.common.getStartOfDayDate();
                return {
                    _id: NEW_ACTION_ID,
                    adviceIds: [],
                    afterActionIds: [],
                    archived: false,
                    beforeActionIds: [],
                    categoryIds: [],
                    createdDate: today,
                    dueDate: today,
                    doneDate: undefined,
                    estimationBased: true,
                    kanbanState: 0,
                    lastNumDaysInPlanning: 0,
                    lastNumDaysInProgress: 0,
                    lastNumDaysInReady: 0,
                    motivationIds: [],
                    states: [],
                    numBackMoves: 0,
                    numDaysInPlanning: 0,
                    numDaysInProgress: 0,
                    numDaysInReady: 0,
                    originalPlannedDate: today,
                    phrase: '',
                    plannedDate: today,
                    priority: '2',
                    type: 'action',
                    updatedDate: today,
                    verbBased: false
                };
            };
            ActionRepository.prototype.getReadyActions = function (urgencies, priorities, categoryId, motivationId) {
                return this.getByParameters(urgencies, priorities, to.common.Kanban.Ready, categoryId, motivationId);
            };
            ActionRepository.prototype.getInProgressActions = function (urgencies, priorities, categoryId, motivationId) {
                return this.getByParameters(urgencies, priorities, to.common.Kanban.InProgress, categoryId, motivationId);
            };
            ActionRepository.prototype.getRecentlyDoneActions = function (urgencies, priorities, categoryId, motivationId) {
                return this.getByParameters(urgencies, priorities, to.common.Kanban.RecentlyDone, categoryId, motivationId);
            };
            ActionRepository.prototype.get = function (actionId) {
                var _this = this;
                if (actionId === NEW_ACTION_ID) {
                    return new Promise(function (resolve) {
                        resolve(_this.newAction);
                    });
                }
                return _super.prototype.get.call(this, actionId);
            };
            ActionRepository.prototype.preSave = function (action, today) {
                this.setBrandNewAction();
                action.states.push({
                    number: 1,
                    fromDate: today,
                    state: to.common.Kanban.Planned
                });
            };
            ActionRepository.prototype.update = function (action) {
                if (action.kanbanState == to.common.Kanban.Archived) {
                    action.archivedDate = to.common.getStartOfDayDate();
                    return this.toArchive(action);
                }
                else {
                    return _super.prototype.update.call(this, action);
                }
            };
            ActionRepository.prototype.toArchive = function (action) {
                var _this = this;
                var currentAction = this.mapById[action._id];
                if (!currentAction) {
                    throw 'Could not find action with Id: ' + action._id;
                }
                return this.db.get(action._id).then(function (doc) {
                    return _this.db.remove(doc);
                }).then(function () {
                    delete _this.mapById[action._id];
                    _this.objects.slice(currentAction.cacheIndex, 1);
                    action._id = 'archive_' + to.common.getCurrentDateTimestamp();
                    delete action._rev;
                    return _this.archive.put(action).then(function (record) {
                        return action;
                    });
                }).catch(function (error) {
                    _this.$ionicPopup.alert({
                        title: 'Database Error',
                        template: 'Error archiving action.'
                    });
                });
            };
            ActionRepository.prototype.getByParameters = function (urgencies, priorities, kanbanState, categoryId, motivationId) {
                if (urgencies != to.common.Urgency.All) {
                    urgencies = urgencies.split(',');
                }
                if (priorities != to.common.Priority.All) {
                    priorities = priorities.split(',');
                }
                return this.getAll().then(function (actions) {
                    return actions.filter(function (action) {
                        return (urgencies == to.common.Urgency.All || urgencies.indexOf(to.common.getUrgencyOfAction(action).toString()) >= 0)
                            && (priorities == to.common.Priority.All || priorities.indexOf(action.priority.toString()) >= 0)
                            && ((kanbanState == to.common.Kanban.AllIncomplete && action.kanbanState < to.common.Kanban.RecentlyDone)
                                || action.kanbanState == kanbanState)
                            && (categoryId == 0 || action.categoryIds.indexOf(categoryId) >= 0)
                            && (motivationId == 0 || action.motivationIds.indexOf(motivationId) >= 0);
                    });
                });
            };
            ActionRepository.prototype.getAllIncomplete = function () {
                return this.getByParameters("5", "5", "5", "0", "0");
            };
            ActionRepository.prototype.getAllPlanned = function () {
                return this.getByParameters("5", "5", "0", "0", "0");
            };
            return ActionRepository;
        }(storage.CachedRepository));
        storage.ActionRepository = ActionRepository;
        angular.module('organizator').service('actionRepository', ActionRepository);
    })(storage = to.storage || (to.storage = {}));
})(to || (to = {}));
//# sourceMappingURL=ActionRepository.js.map