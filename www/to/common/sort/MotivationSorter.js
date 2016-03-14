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
            var MotivationSorter = (function (_super) {
                __extends(MotivationSorter, _super);
                function MotivationSorter($ionicPopup, $scope, motivations, pickState) {
                    _super.call(this, $ionicPopup, $scope, pickState);
                    this.motivations = motivations;
                }
                MotivationSorter.prototype.showSortPopup = function () {
                    _super.prototype.showSortPopup.call(this, 'to/common/sort/SortMotivationsPopupView.html');
                };
                MotivationSorter.prototype.sort = function () {
                    this.motivations.sort(sortMotivations);
                };
                MotivationSorter.prototype.getSortSymbol = function () {
                    switch (sort.currentSortState.sortBy) {
                        case 'IMPACT':
                            return '<i class="fa fa-smile-o urgency-sort"></i>';
                        case 'NAME':
                            return '<i class="icon-quill name-sort"></i>';
                        case 'NUM_PLANNED':
                            return '<i class="fa fa-briefcase planned-sort"></i>';
                        case 'NUM_READY':
                            return '<i class="ion-clipboard ion-icon-sort"></i>';
                        case 'NUM_IN_PROGRESS':
                            return '<i class="ion-hammer ion-icon-sort"></i>';
                    }
                };
                return MotivationSorter;
            }(sort.Sorter));
            sort.MotivationSorter = MotivationSorter;
            function sortMotivations(motivation1, motivation2) {
                var value1;
                var value2;
                switch (sort.currentSortState.sortBy) {
                    case 'IMPACT':
                        value1 = motivation1.impact;
                        value2 = motivation2.impact;
                        break;
                    case 'NAME':
                        value1 = motivation1.description.toLocaleLowerCase();
                        value2 = motivation2.description.toLocaleLowerCase();
                    case 'NUM_IN_PROGRESS':
                        value1 = motivation1.numInProgressActions;
                        value2 = motivation2.numInProgressActions;
                        break;
                    case 'NUM_PLANNED':
                        value1 = motivation1.numPlannedActions;
                        value2 = motivation2.numPlannedActions;
                        break;
                        break;
                    case 'NUM_READY':
                        value1 = motivation1.numReadyActions;
                        value2 = motivation2.numReadyActions;
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
//# sourceMappingURL=MotivationSorter.js.map