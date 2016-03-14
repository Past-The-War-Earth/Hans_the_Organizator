var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var enter;
    (function (enter) {
        var ViewActionController = (function (_super) {
            __extends(ViewActionController, _super);
            function ViewActionController($ionicHistory, $ionicPopup, $scope, $state, $stateParams, actionRepository, actionService, archiveRepository, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, actionService, categoryRepository, motivationRepository, 'ViewActionController', 'Action');
                this.$ionicPopup = $ionicPopup;
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.archiveRepository = archiveRepository;
                this.asParagraph = false;
                this.newKanbanState = this.Kanban.Planned;
                this.reload();
            }
            ViewActionController.prototype.reload = function () {
                var _this = this;
                return _super.prototype.reload.call(this).then(function () {
                    var promise;
                    if (_this.$stateParams.archive) {
                        promise = _this.archiveRepository.get(_this.$stateParams.actionId);
                    }
                    else {
                        promise = _this.actionRepository.get(_this.$stateParams.actionId);
                    }
                    promise.then(function (action) {
                        _this.action = action;
                        var operations = [_this.categoryRepository.getAllByIds(_this.action.categoryIds),
                            _this.motivationRepository.getAllByIds(_this.action.motivationIds),
                            _this.actionRepository.getAllByIds(_this.action.beforeActionIds),
                            _this.actionRepository.getAllByIds(_this.action.afterActionIds)];
                        Promise.all(operations).then(function (results) {
                            _this.categories = results[0];
                            _this.motivations = results[1];
                            _this.beforeActions = results[2];
                            _this.afterActions = results[3];
                            _this.asParagraph = action.verbBased;
                            _this.deferred = _this;
                            if (!_this.$stateParams.archive) {
                                to.common.setDueValueAndUrgency(_this, _this.action);
                            }
                            _this.afterDataLoad();
                        });
                    });
                });
            };
            ViewActionController.prototype.getDisplayTypeHtml = function () {
                return this.asParagraph ? 'In writing' : 'Itemized';
            };
            ViewActionController.prototype.getDisplayTypeClass = function () {
                return this.asParagraph ? 'icon-quill' : 'icon-list2';
            };
            ViewActionController.prototype.changeDisplayType = function () {
                this.asParagraph = !this.asParagraph;
            };
            ViewActionController.prototype.getParagraphHtml = function () {
                var state = to.common.getKanbanState(this.action.kanbanState);
                var belongsTo = '';
                if (this.categories && this.categories.length) {
                    belongsTo = this.asPartOfLabel();
                }
                var action = _super.prototype.getInputValue.call(this, "I " + this.actionOptions[this.action.priority]);
                var paragraph = '';
                if (this.motivations && this.motivations.length) {
                    paragraph += '<p> Because of ' + _super.prototype.getInputValue.call(this, this.getMotivationsList()) + '</p>';
                }
                paragraph += "<p>" + action + " " + this.action.phrase + "</p>";
                if (belongsTo) {
                    paragraph += "<p>" + belongsTo + "</p>";
                }
                paragraph += "<p>" + this.getDueFragment() + "</p>";
                var sinceDate = this.getSinceDate();
                paragraph += "<p>It has been " + state + " since " + sinceDate + ".</p>";
                return paragraph;
            };
            ViewActionController.prototype.getDueFragment = function () {
                var dueFragment;
                if (this.action.kanbanState < to.common.Kanban.RecentlyDone) {
                    var duePeriod = this.getDuePeriod();
                    dueFragment = 'It is due';
                    if (this.dueValue > 0) {
                        dueFragment += " in " + this.dueValue + " " + duePeriod;
                        if (this.dueRemainderDays > 0) {
                            dueFragment += " and " + this.dueRemainderDays + " days (" + this.action.dueDate.toLocaleDateString() + ").";
                        }
                    }
                    else {
                        dueFragment += ' Now.';
                    }
                }
                else {
                    dueFragment = 'It was due ' + this.action.dueDate.toLocaleDateString();
                }
                return dueFragment;
            };
            ViewActionController.prototype.getUrgencyClassOrDone = function () {
                if (this.action.kanbanState < to.common.Kanban.RecentlyDone) {
                    return this.getUrgencyClass(this.action);
                }
                else {
                    return 'fa-ship';
                }
            };
            ViewActionController.prototype.getStateName = function (actionState) {
                return to.common.getKanbanState(actionState.state);
            };
            ViewActionController.prototype.getPriorityLabel = function () {
                return "It is " + to.common.getPriorityLabel(this.action.priority);
            };
            ViewActionController.prototype.getNumDaysInState = function (actionState) {
                if (actionState.number === this.action.states.length) {
                    return to.common.getNumDaysSinceDate(actionState.fromDate) + ' days';
                }
                else {
                    return actionState.numDays + ' days';
                }
            };
            ViewActionController.prototype.getStateDetails = function (actionState) {
                return this.getStateName(actionState) + " (" + this.getNumDaysInState(actionState) + ")";
            };
            ViewActionController.prototype.getMoveToStateDate = function (actionState) {
                return actionState.fromDate.toLocaleDateString();
            };
            ViewActionController.prototype.changeState = function () {
                var _this = this;
                this.$ionicPopup.show({
                    templateUrl: 'to/view/MoveActionStatePopupView.html',
                    title: 'Move Action to',
                    scope: this.$scope,
                    buttons: [
                        { text: 'Cancel' },
                        {
                            text: '<b>Move</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                _this.newKanbanState = parseInt(_this.newKanbanState);
                                _this.changeActionState(_this.newKanbanState);
                                return true;
                            }
                        }
                    ]
                });
            };
            ViewActionController.prototype.changeActionState = function (newState) {
                var currentKanbanState = parseInt(this.action.kanbanState);
                if (newState != currentKanbanState) {
                    this.actionService.changeKanbanState(this.action, newState - currentKanbanState);
                }
                this.back();
            };
            ViewActionController.prototype.edit = function () {
                this.editAction(this.action);
            };
            ViewActionController.prototype.copy = function () {
                this.actionRepository.copyActionToNew(this.action);
                this.$state.go(to.common.states.ENTER_ACTION, { brandNew: 'N' });
            };
            ViewActionController.prototype.viewCategory = function (category) {
                this.$state.go(to.common.states.VIEW_CATEGORY, { id: category._id });
            };
            ViewActionController.prototype.viewMotivation = function (motivation) {
                this.$state.go(to.common.states.VIEW_MOTIVATION, { id: motivation._id });
            };
            ViewActionController.prototype.share = function () {
            };
            ViewActionController.prototype.getSinceDate = function () {
                switch (parseInt(this.action.kanbanState)) {
                    case to.common.Kanban.Planned:
                        return this.action.createdDate.toLocaleDateString();
                    case to.common.Kanban.Ready:
                        return this.action.readyDate.toLocaleDateString();
                    case to.common.Kanban.InProgress:
                        return this.action.startDate.toLocaleDateString();
                    case to.common.Kanban.RecentlyDone:
                    case to.common.Kanban.Archived:
                        return this.action.doneDate.toLocaleDateString();
                }
            };
            ViewActionController.prototype.getDuePeriod = function () {
                return to.common.getUrgencyLabel(this.urgency);
            };
            ViewActionController.prototype.isIncompleteAction = function () {
                switch (parseInt(this.action.kanbanState)) {
                    case this.Kanban.Archived:
                    case this.Kanban.RecentlyDone:
                        return false;
                }
                return true;
            };
            ViewActionController.prototype.canRemoveBeforeAction = function (action) {
                return false;
            };
            ViewActionController.prototype.canRemoveAfterAction = function (action) {
                return false;
            };
            return ViewActionController;
        })(to.common.ActionController);
        angular.module('organizator').controller('ViewActionController', ViewActionController);
    })(enter = to.enter || (to.enter = {}));
})(to || (to = {}));
//# sourceMappingURL=ViewActionController.js.map