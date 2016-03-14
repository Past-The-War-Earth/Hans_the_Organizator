///<reference path="../imports.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by artem on 3/28/15.
 */
var to;
(function (to) {
    var common;
    (function (common) {
        var CategoryController = (function (_super) {
            __extends(CategoryController, _super);
            function CategoryController($ionicHistory, $scope, $state, name, title) {
                _super.call(this, $ionicHistory, $scope, $state, name, title);
                this.priorityOptions = [
                    'Peripheral',
                    'Minor',
                    'Significant',
                    'Crucial',
                    'Paramount'
                ];
            }
            CategoryController.prototype.getPriorityLabel = function () {
                var priority = 'N/A';
                if (this.category) {
                    priority = this.priorityOptions[this.category.priority];
                }
                return 'Category\'s priority? ' + this.getInputValue(priority);
            };
            CategoryController.prototype.getCategoryPriority = function () {
                var priority = 'N/A';
                if (this.category) {
                    priority = this.priorityOptions[this.category.priority];
                }
                return this.getInputValue(priority);
            };
            CategoryController.prototype.getCoachingLabel = function () {
                var coaching = 'N/A';
                if (this.category) {
                    coaching = to.common.getCoachingLabel(this.category.helpLevel);
                }
                return this.getInputValue(coaching);
            };
            return CategoryController;
        }(common.BranchComponent));
        common.CategoryController = CategoryController;
    })(common = to.common || (to.common = {}));
})(to || (to = {}));
//# sourceMappingURL=CategoryController.js.map