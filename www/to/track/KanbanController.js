var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var track;
    (function (track) {
        var KanbanController = (function (_super) {
            __extends(KanbanController, _super);
            function KanbanController($ionicActionSheet, $ionicHistory, $scope, $state, $stateParams, actionRepository, actionService, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'KanbanController', 'Progress');
                this.$ionicActionSheet = $ionicActionSheet;
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.actionService = actionService;
                this.svgTopPosition = 0;
                this.showStateNavigation = false;
                this.reload();
            }
            KanbanController.prototype.reload = function () {
                var _this = this;
                var urgencies = this.$stateParams.urgencies;
                var priorities = this.$stateParams.priorities;
                var categoryId = this.$stateParams.categoryId;
                var motivationId = this.$stateParams.motivationId;
                var operations = [this.actionRepository.getMap(),
                    this.actionRepository.getReadyActions(urgencies, priorities, categoryId, motivationId),
                    this.actionRepository.getInProgressActions(urgencies, priorities, categoryId, motivationId),
                    this.actionRepository.getRecentlyDoneActions(urgencies, priorities, categoryId, motivationId)];
                return Promise.all(operations).then(function (results) {
                    var actionMap = results[0];
                    var readyActions = results[1];
                    var inProgressActions = results[2];
                    var recentlyDoneActions = results[3];
                    var rendering = new track.KanbanRendering(readyActions, inProgressActions, recentlyDoneActions, actionMap);
                    _this.allRenderedActions = rendering.getActions();
                    _this.allConnections = rendering.getConnections();
                    _this.chartHeight = rendering.getChartHeight();
                    _this.afterDataLoad();
                });
            };
            KanbanController.prototype.onActionRenderingClick = function (actionRendering) {
                if (!this.selectedAction) {
                    this.svgTopPosition = this.svgTopPosition + 96;
                }
                if (this.selectedAction) {
                    this.selectedAction.classes['selected-action'] = false;
                    for (var actionId in this.selectedAction.connectionMap) {
                        var connection = this.selectedAction.connectionMap[actionId];
                        connection.classes['selected-action'] = false;
                    }
                }
                this.selectedAction = actionRendering;
                var action = this.selectedAction.action;
                this.actions = [action];
                actionRendering.classes['selected-action'] = true;
                for (var actionId in actionRendering.connectionMap) {
                    var connection = actionRendering.connectionMap[actionId];
                    connection.classes['selected-action'] = true;
                }
                switch (parseInt(action.kanbanState)) {
                    case to.common.Kanban.Ready:
                        this.onReadyClick(action);
                        break;
                    case to.common.Kanban.InProgress:
                        this.onInProgressClick(action);
                        break;
                    case to.common.Kanban.RecentlyDone:
                        this.onRecentlyDoneClick(action);
                        break;
                }
            };
            KanbanController.prototype.onReadyClick = function (readyAction) {
                var _this = this;
                this.hideStateNavigation();
                this.$ionicActionSheet.show({
                    buttons: [
                        { text: this.getMoveToLabel(to.common.Kanban.InProgress) },
                        { text: this.getMoveToLabel(to.common.Kanban.Planned) },
                        { text: 'View' },
                    ],
                    titleText: readyAction.phrase,
                    cancelText: 'Cancel',
                    buttonClicked: function (index) {
                        _this.actionSheetButtonClick(readyAction, index);
                        return true;
                    }
                });
            };
            KanbanController.prototype.actionSheetButtonClick = function (action, index) {
                var _this = this;
                switch (index) {
                    case 0:
                        this.actionService.changeKanbanState(action, 1).then(function () {
                            _this.reload();
                            _this.doneModifying();
                        });
                        break;
                    case 1:
                        if (action.kanbanState != this.Kanban.RecentlyDone) {
                            this.actionService.changeKanbanState(action, -1).then(function () {
                                _this.reload();
                                _this.doneModifying();
                            });
                            break;
                        }
                    case 2:
                        var params = {
                            actionId: action._id
                        };
                        this.$state.go(to.common.states.VIEW_ACTION, params);
                        break;
                }
            };
            KanbanController.prototype.onInProgressClick = function (inProgressAction) {
                var _this = this;
                this.hideStateNavigation();
                this.$ionicActionSheet.show({
                    buttons: [
                        { text: this.getMoveToLabel(to.common.Kanban.RecentlyDone) },
                        { text: this.getMoveToLabel(to.common.Kanban.Ready) },
                        { text: 'View' },
                    ],
                    titleText: inProgressAction.phrase,
                    cancelText: 'Cancel',
                    buttonClicked: function (index) {
                        _this.actionSheetButtonClick(inProgressAction, index);
                        return true;
                    }
                });
            };
            KanbanController.prototype.onRecentlyDoneClick = function (recentlyDoneAction) {
                var _this = this;
                this.hideStateNavigation();
                this.$ionicActionSheet.show({
                    buttons: [
                        { text: this.getMoveToLabel(to.common.Kanban.Archived) },
                        { text: 'View' },
                    ],
                    titleText: recentlyDoneAction.phrase,
                    cancelText: 'Cancel',
                    buttonClicked: function (index) {
                        _this.actionSheetButtonClick(recentlyDoneAction, index);
                        return true;
                    }
                });
            };
            KanbanController.prototype.getMoveToLabel = function (kanbanState) {
                return "Move to: " + to.common.getKanbanState(kanbanState);
            };
            KanbanController.prototype.onStateClick = function (kanbanState) {
                if (!this.showStateNavigation) {
                    this.svgTopPosition = this.svgTopPosition + 36;
                }
                this.currentState = kanbanState;
                this.showStateNavigation = true;
            };
            KanbanController.prototype.getSelectedStateClass = function (kanbanState) {
                return kanbanState == this.currentState ? 'selected-state' : '';
            };
            KanbanController.prototype.getParams = function () {
                var params = {};
                params.kanbanState = this.currentState;
                params.urgencies = this.$stateParams.urgencies;
                params.priorities = this.$stateParams.priorities;
                params.categoryId = this.$stateParams.categoryId;
                params.motivationId = this.$stateParams.motivationId;
                return params;
            };
            KanbanController.prototype.viewEisenhower = function () {
                var params = this.getParams();
                this.hideStateNavigation();
                this.$state.go(to.common.states.EISENHOWER, params);
            };
            KanbanController.prototype.viewCategories = function () {
                var params = this.getParams();
                delete params.categoryId;
                this.hideStateNavigation();
                this.$state.go(to.common.states.CATEGORIES, params);
            };
            KanbanController.prototype.viewMotivations = function () {
                var params = this.getParams();
                delete params.motivationId;
                this.hideStateNavigation();
                this.$state.go(to.common.states.MOTIVATIONS, params);
            };
            KanbanController.prototype.hideStateNavigation = function () {
                if (this.showStateNavigation) {
                    this.svgTopPosition = this.svgTopPosition - 36;
                }
                this.showStateNavigation = false;
                this.currentState = null;
            };
            return KanbanController;
        })(to.common.ActionsController);
        angular.module('organizator').controller('KanbanController', KanbanController);
    })(track = to.track || (to.track = {}));
})(to || (to = {}));
//# sourceMappingURL=KanbanController.js.map