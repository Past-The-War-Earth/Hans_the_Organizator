var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var act;
    (function (act) {
        var sortBy;
        var ascending;
        var currentSortState = {
            sortBy: 'URGENCY',
            ascending: false
        };
        var PlansController = (function (_super) {
            __extends(PlansController, _super);
            function PlansController($ionicHistory, $ionicPopup, $scope, $state, actionRepository, actionService, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'PlansController', 'Plan');
                this.$ionicPopup = $ionicPopup;
                this.actionRepository = actionRepository;
                this.actionService = actionService;
                this.reload();
            }
            PlansController.prototype.reload = function () {
                var _this = this;
                return _super.prototype.reload.call(this).then(function () {
                    return _this.actionRepository.getAllPlanned().then(function (actions) {
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
            PlansController.prototype.trackActions = function () {
                this.$state.go(to.common.states.EISENHOWER, { kanbanState: to.common.Kanban.Planned });
            };
            PlansController.prototype.addAction = function () {
                this.$state.go(to.common.states.ENTER_ACTION);
            };
            return PlansController;
        })(to.common.ActionsController);
        angular.module('organizator').controller('PlansController', PlansController);
    })(act = to.act || (to.act = {}));
})(to || (to = {}));
//# sourceMappingURL=PlansController.js.map