var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var act;
    (function (act) {
        function getViewLabel(kanbanState) {
            if (kanbanState == to.common.Kanban.Archived) {
                return 'Archive';
            }
            else if (kanbanState == to.common.Kanban.Planned) {
                return 'Plans';
            }
            return 'Actions';
        }
        var ListActionsController = (function (_super) {
            __extends(ListActionsController, _super);
            function ListActionsController($ionicHistory, $ionicPopup, $scope, $state, $stateParams, actionRepository, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'ListActionsController', getViewLabel($stateParams.kanbanState));
                this.$ionicPopup = $ionicPopup;
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.reload();
            }
            ListActionsController.prototype.trackActions = function () {
                this.$state.go(to.common.states.EISENHOWER, this.$stateParams);
            };
            ListActionsController.prototype.reload = function () {
                var _this = this;
                return _super.prototype.reload.call(this).then(function () {
                    return _this.actionRepository.getByParameters(_this.$stateParams.urgencies, _this.$stateParams.priorities, _this.$stateParams.kanbanState, _this.$stateParams.categoryId, _this.$stateParams.motivationId).then(function (actions) {
                        _this.actions = actions;
                        _this.sorter = new to.common.sort.ActionSorter(_this.$ionicPopup, _this.$scope, _this.actions, {
                            sortBy: 'URGENCY',
                            ascending: false
                        });
                        _this.sorter.sort();
                        _this.afterDataLoad();
                    });
                });
            };
            return ListActionsController;
        })(to.common.ActionsController);
        angular.module('organizator').controller('ListActionsController', ListActionsController);
    })(act = to.act || (to.act = {}));
})(to || (to = {}));
//# sourceMappingURL=ListActionsController.js.map