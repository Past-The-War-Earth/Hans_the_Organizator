///<reference path="../../imports.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Papa on 2/14/2016.
 */
var to;
(function (to) {
    var revenue;
    (function (revenue) {
        var us;
        (function (us) {
            var ListAdEngine = (function (_super) {
                __extends(ListAdEngine, _super);
                function ListAdEngine() {
                    _super.apply(this, arguments);
                }
                ListAdEngine.prototype.getListAdPositions = function (list, listType) {
                    var adPositionList = [listType];
                    return adPositionList;
                };
                return ListAdEngine;
            }(to.revenue.ListAdEngine));
            us.ListAdEngine = ListAdEngine;
        })(us = revenue.us || (revenue.us = {}));
    })(revenue = to.revenue || (to.revenue = {}));
})(to || (to = {}));
//# sourceMappingURL=ListAdEngine.js.map