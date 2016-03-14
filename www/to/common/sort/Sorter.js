///<reference path="../../imports.ts"/>
/**
 * Created by artem on 5/9/15.
 */
var to;
(function (to) {
    var common;
    (function (common) {
        var sort;
        (function (sort) {
            sort.currentSortState = {
                sortBy: 'URGENCY',
                ascending: false
            };
            var Sorter = (function () {
                function Sorter($ionicPopup, $scope, pickState) {
                    this.$ionicPopup = $ionicPopup;
                    this.$scope = $scope;
                    this.pickState = pickState;
                    sort.currentSortState = this.pickState;
                }
                Sorter.prototype.showSortPopup = function (viewUrl) {
                    var _this = this;
                    this.pickState = JSON.parse(JSON.stringify(sort.currentSortState));
                    var sortPopup = this.$ionicPopup.show({
                        templateUrl: viewUrl,
                        title: 'Sort By',
                        scope: this.$scope,
                        buttons: [
                            { text: 'Cancel' },
                            {
                                text: '<b>Sort</b>',
                                type: 'button-positive',
                                onTap: function (e) {
                                    _this.setCurrentSortState();
                                    _this.sort();
                                    return true;
                                }
                            }
                        ]
                    });
                };
                Sorter.prototype.sort = function () {
                    // abstract
                };
                Sorter.prototype.getCurrentSortState = function () {
                    return sort.currentSortState;
                };
                Sorter.prototype.setCurrentSortState = function () {
                    sort.currentSortState = this.pickState;
                    console.log('sorting by: ' + sort.currentSortState.sortBy + ', ascending: ' + sort.currentSortState.ascending);
                };
                Sorter.prototype.getSortOrderLabel = function () {
                    return this.pickState.ascending ? 'Ascending' : 'Descending';
                };
                Sorter.prototype.getSortOrderStyle = function () {
                    return sort.currentSortState.ascending ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc';
                };
                return Sorter;
            }());
            sort.Sorter = Sorter;
        })(sort = common.sort || (common.sort = {}));
    })(common = to.common || (to.common = {}));
})(to || (to = {}));
//# sourceMappingURL=Sorter.js.map