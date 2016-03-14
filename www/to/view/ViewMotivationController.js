var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var enter;
    (function (enter) {
        var ViewMotivationController = (function (_super) {
            __extends(ViewMotivationController, _super);
            function ViewMotivationController($ionicHistory, $ionicPopup, $scope, $state, $stateParams, actionRepository, actionService, archiveRepository, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, 'ViewMotivationController', 'Reason');
                this.$ionicPopup = $ionicPopup;
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.actionService = actionService;
                this.archiveRepository = archiveRepository;
                this.categoryRepository = categoryRepository;
                this.motivationRepository = motivationRepository;
                this.reload();
            }
            ViewMotivationController.prototype.reload = function () {
                var _this = this;
                this.motivationRepository.get(this.$stateParams.motivationId).then(function (motivation) {
                    _this.motivation = motivation;
                    _this.loaded = true;
                    _this.afterDataLoad();
                });
            };
            ViewMotivationController.prototype.viewPlans = function () {
                this.$stateParams.kanbanState = to.common.Kanban.Planned;
                this.$state.go(to.common.states.LIST_ACTIONS, this.$stateParams);
            };
            ViewMotivationController.prototype.viewKanban = function () {
                this.$state.go(to.common.states.KANBAN, this.$stateParams);
            };
            ViewMotivationController.prototype.viewEisenhower = function () {
                this.$state.go(to.common.states.EISENHOWER, this.$stateParams);
            };
            ViewMotivationController.prototype.viewCategories = function () {
                this.$state.go(to.common.states.CATEGORIES, this.$stateParams);
            };
            ViewMotivationController.prototype.edit = function () {
                this.$state.go(to.common.states.EDIT_MOTIVATION, { id: this.motivation._id });
            };
            return ViewMotivationController;
        })(to.common.MotivationController);
        angular.module('organizator').controller('ViewMotivationController', ViewMotivationController);
    })(enter = to.enter || (to.enter = {}));
})(to || (to = {}));
//# sourceMappingURL=ViewMotivationController.js.map