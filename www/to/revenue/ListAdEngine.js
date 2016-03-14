///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/15/2016.
 */
var to;
(function (to) {
    var revenue;
    (function (revenue) {
        (function (ListAdType) {
        })(revenue.ListAdType || (revenue.ListAdType = {}));
        var ListAdType = revenue.ListAdType;
        var ListAdEngine = (function () {
            function ListAdEngine() {
                this.moreAds = false;
            }
            ListAdEngine.prototype.addAddsToList = function (list, listType) {
                var listAdPositions = this.getListAdPositions(list, listType);
                var totalNumItems = list.length + listAdPositions.length;
                if (!this.moreAds) {
                    totalNumItems--;
                }
                var numAddsAdded = 0;
                for (var i = 0; i < totalNumItems; i++) {
                    var adIndex = this.getAdIndex(i, listAdPositions);
                    if (adIndex) {
                        var ad = {};
                        list.splice(i, 0, ad);
                    }
                }
                return list;
            };
            ListAdEngine.prototype.getAdIndex = function (listPosition, listAdPositions) {
                var adIndex;
                listAdPositions.some(function (listAdPosition) {
                    if (listAdPosition === listPosition) {
                        adIndex = listAdPosition;
                        return true;
                    }
                });
                return adIndex;
            };
            return ListAdEngine;
        }());
        revenue.ListAdEngine = ListAdEngine;
    })(revenue = to.revenue || (to.revenue = {}));
})(to || (to = {}));
//# sourceMappingURL=ListAdEngine.js.map