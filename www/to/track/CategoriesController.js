var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var enter;
    (function (enter) {
        var CategoriesController = (function (_super) {
            __extends(CategoriesController, _super);
            function CategoriesController($ionicHistory, $ionicPopup, $scope, $state, $stateParams, categoryRepository) {
                _super.call(this, $ionicHistory, $scope, $state, 'CategoriesController', 'Categories');
                this.$ionicPopup = $ionicPopup;
                this.$stateParams = $stateParams;
                this.categoryRepository = categoryRepository;
                this.reload();
            }
            CategoriesController.prototype.reload = function () {
                var _this = this;
                this.categoryRepository.getByParameters(this.$stateParams.urgencies, this.$stateParams.priorities, this.$stateParams.kanbanState, this.$stateParams.motivationId).then(function (categories) {
                    _this.categories = categories;
                    _this.sorter = new to.common.sort.CategorySorter(_this.$ionicPopup, _this.$scope, _this.categories, {
                        sortBy: 'NAME',
                        ascending: true
                    });
                    _this.afterDataLoad();
                });
            };
            CategoriesController.prototype.addCategory = function () {
                this.$state.go(to.common.states.ENTER_CATEGORY);
            };
            CategoriesController.prototype.selectCategory = function (category) {
                this.$stateParams.categoryId = category._id;
                this.$state.go(to.common.states.VIEW_CATEGORY, this.$stateParams);
            };
            CategoriesController.prototype.listActions = function (category) {
                this.$state.go(to.common.states.LIST_ACTIONS, this.$stateParams);
            };
            return CategoriesController;
        })(to.common.BranchComponent);
        angular.module('organizator').controller('CategoriesController', CategoriesController);
    })(enter = to.enter || (to.enter = {}));
})(to || (to = {}));
//# sourceMappingURL=CategoriesController.js.map