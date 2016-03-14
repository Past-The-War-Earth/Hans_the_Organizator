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
            var ActionSorter = (function (_super) {
                __extends(ActionSorter, _super);
                function ActionSorter($ionicPopup, $scope, actions, pickState) {
                    _super.call(this, $ionicPopup, $scope, pickState);
                    this.actions = actions;
                }
                ActionSorter.prototype.showSortPopup = function () {
                    _super.prototype.showSortPopup.call(this, 'to/common/sort/SortActionsPopupView.html');
                };
                ActionSorter.prototype.sort = function () {
                    this.actions.sort(sortActions);
                };
                ActionSorter.prototype.getSortSymbol = function () {
                    switch (sort.currentSortState.sortBy) {
                        case 'CREATED':
                            return '<i class="fa fa-lightbulb-o"></i>';
                        case 'NAME':
                            return '<i class="icon-quill name-sort"></i>';
                        case 'PRIORITY':
                            return '<i class="icon-list-numbered priority-sort"></i>';
                        case 'MODIFIED':
                            return '<i class="fa fa-save updated-date-sort"></i>';
                        case 'URGENCY':
                            return '<i class="fa fa-clock-o urgency-sort"></i>';
                    }
                };
                ActionSorter.prototype.getSortedProperty = function (action) {
                    switch (this.getCurrentSortState().sortBy) {
                        case 'CREATED':
                            return action.createdDate.toLocaleDateString();
                        case 'MODIFIED':
                            return action.updatedDate.toLocaleDateString();
                        case 'NAME':
                        case 'PRIORITY':
                        case 'URGENCY':
                            return '';
                    }
                };
                return ActionSorter;
            }(sort.Sorter));
            sort.ActionSorter = ActionSorter;
            function sortActions(action1, action2) {
                var value1;
                var value2;
                switch (sort.currentSortState.sortBy) {
                    case 'CREATED':
                        value1 = action1.createdDate;
                        value2 = action2.createdDate;
                        break;
                    case 'NAME':
                        value1 = action1.phrase.toLocaleLowerCase();
                        value2 = action2.phrase.toLocaleLowerCase();
                        break;
                    case 'PRIORITY':
                        value1 = action1.priority;
                        value2 = action2.priority;
                        break;
                    case 'MODIFIED':
                        value1 = action1.updatedDate;
                        value2 = action2.updatedDate;
                        break;
                    case 'URGENCY':
                        // Flip the dates for urgency
                        value1 = action2.dueDate;
                        value2 = action1.dueDate;
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
//# sourceMappingURL=ActionSorter.js.map