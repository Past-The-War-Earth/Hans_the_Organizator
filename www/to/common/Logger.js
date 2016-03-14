///<reference path="../imports.ts"/>
/**
 * Created by artem on 3/29/15.
 */
var to;
(function (to) {
    var common;
    (function (common) {
        var Logger = (function () {
            function Logger(componentName) {
                this.componentName = componentName;
            }
            Logger.prototype.trace = function (message) {
                console.log('TRACE: ' + new Date() + '[' + this.componentName + ']' + message);
            };
            Logger.prototype.debug = function (message) {
                console.log('DEBUG: ' + new Date() + '[' + this.componentName + ']' + message);
            };
            return Logger;
        }());
        common.Logger = Logger;
    })(common = to.common || (to.common = {}));
})(to || (to = {}));
//# sourceMappingURL=Logger.js.map