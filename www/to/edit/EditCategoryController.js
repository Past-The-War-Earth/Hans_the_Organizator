var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var enter;
    (function (enter) {
        var EditCategoryController = (function (_super) {
            __extends(EditCategoryController, _super);
            function EditCategoryController($ionicHistory, $scope, $state, $stateParams, categoryRepository) {
                var _this = this;
                _super.call(this, $ionicHistory, $scope, $state, 'EditCategoryController', 'Category');
                this.$stateParams = $stateParams;
                this.categoryRepository = categoryRepository;
                categoryRepository.get($stateParams.id).then(function (category) {
                    _this.category = category;
                    var unbindHandler = $scope.$on('$ionicView.beforeLeave', function () {
                        _this.categoryRepository.update(_this.category);
                        unbindHandler();
                    });
                    _this.afterDataLoad();
                });
            }
            EditCategoryController.prototype.saveCategory = function () {
                var _this = this;
                this.categoryRepository.update(this.category).then(function () {
                    _this.back();
                });
            };
            EditCategoryController.prototype.saveCategoryLabel = function () {
                return 'Save';
            };
            return EditCategoryController;
        })(to.common.CategoryController);
        angular.module('organizator').controller('EditCategoryController', EditCategoryController);
    })(enter = to.enter || (to.enter = {}));
})(to || (to = {}));
//# sourceMappingURL=EditCategoryController.js.map