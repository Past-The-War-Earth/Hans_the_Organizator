var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var enter;
    (function (enter) {
        var ViewCategoryController = (function (_super) {
            __extends(ViewCategoryController, _super);
            function ViewCategoryController($ionicHistory, $ionicPopup, $scope, $state, $stateParams, actionRepository, actionService, archiveRepository, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, 'ViewCategoryController', 'Category');
                this.$ionicPopup = $ionicPopup;
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.actionService = actionService;
                this.archiveRepository = archiveRepository;
                this.categoryRepository = categoryRepository;
                this.motivationRepository = motivationRepository;
                this.reload();
            }
            ViewCategoryController.prototype.reload = function () {
                var _this = this;
                this.categoryRepository.get(this.$stateParams.categoryId)
                    .then(function (category) {
                    _this.category = category;
                    _this.loaded = true;
                    _this.afterDataLoad();
                });
            };
            ViewCategoryController.prototype.viewPlans = function () {
                this.$stateParams.kanbanState = to.common.Kanban.Planned;
                this.$state.go(to.common.states.LIST_ACTIONS, this.$stateParams);
            };
            ViewCategoryController.prototype.viewKanban = function () {
                this.$state.go(to.common.states.KANBAN, this.$stateParams);
            };
            ViewCategoryController.prototype.viewEisenhower = function () {
                this.$state.go(to.common.states.EISENHOWER, this.$stateParams);
            };
            ViewCategoryController.prototype.viewMotivations = function () {
                this.$state.go(to.common.states.MOTIVATIONS, this.$stateParams);
            };
            ViewCategoryController.prototype.edit = function () {
                this.$state.go(to.common.states.EDIT_CATEGORY, { id: this.category._id });
            };
            return ViewCategoryController;
        })(to.common.CategoryController);
        angular.module('organizator').controller('ViewCategoryController', ViewCategoryController);
    })(enter = to.enter || (to.enter = {}));
})(to || (to = {}));
//# sourceMappingURL=ViewCategoryController.js.map