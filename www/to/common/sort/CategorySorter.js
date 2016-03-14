///<reference path="../../imports.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by artem on 5/14/15.
 */
var to;
(function (to) {
    var common;
    (function (common) {
        var sort;
        (function (sort) {
            var CategorySorter = (function (_super) {
                __extends(CategorySorter, _super);
                function CategorySorter($ionicPopup, $scope, categories, pickState) {
                    _super.call(this, $ionicPopup, $scope, pickState);
                    this.categories = categories;
                }
                CategorySorter.prototype.showSortPopup = function () {
                    _super.prototype.showSortPopup.call(this, 'to/common/sort/SortCategoriesPopupView.html');
                };
                CategorySorter.prototype.sort = function () {
                    this.categories.sort(sortCategories);
                };
                CategorySorter.prototype.getSortSymbol = function () {
                    switch (sort.currentSortState.sortBy) {
                        case 'PRIORITY':
                            return '<i class="icon-list-numbered priority-sort"></i>';
                        case 'TIMEOUT':
                            return '<i class="icon-quill name-sort"></i>';
                        case 'NUM_PLANNED':
                            return '<i class="fa fa-briefcase planned-sort"></i>';
                        case 'NUM_READY':
                            return '<i class="ion-clipboard ion-icon-sort"></i>';
                        case 'NUM_IN_PROGRESS':
                            return '<i class="ion-hammer ion-icon-sort"></i>';
                    }
                };
                return CategorySorter;
            }(sort.Sorter));
            sort.CategorySorter = CategorySorter;
            function sortCategories(category1, category2) {
                var value1;
                var value2;
                switch (sort.currentSortState.sortBy) {
                    case 'PRIORITY':
                        value1 = category1.priority;
                        value2 = category2.priority;
                        break;
                    case 'TIMEOUT':
                        value1 = category1.name.toLocaleLowerCase();
                        value2 = category2.name.toLocaleLowerCase();
                        break;
                    case 'NUM_IN_PROGRESS':
                        value1 = category1.numInProgressActions;
                        value2 = category2.numInProgressActions;
                        break;
                    case 'NUM_PLANNED':
                        value1 = category1.numPlannedActions;
                        value2 = category2.numPlannedActions;
                        break;
                    case 'NUM_READY':
                        value1 = category1.numReadyActions;
                        value2 = category2.numReadyActions;
                        break;
                }
                if (!sort.currentSortState.ascending) {
                    var tempValue = value1;
                    value1 = value2;
                    value2 = tempValue;
                }
                if (value1 > value2) {
                    return 1;
                }
                else if (value2 > value1) {
                    return -1;
                }
                return 0;
            }
        })(sort = common.sort || (common.sort = {}));
    })(common = to.common || (to.common = {}));
})(to || (to = {}));
//# sourceMappingURL=CategorySorter.js.map