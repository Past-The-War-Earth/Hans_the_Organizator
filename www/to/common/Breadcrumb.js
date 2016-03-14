var to;
(function (to) {
    var common;
    (function (common) {
        var Breadcrumb = (function () {
            function Breadcrumb($stateParams) {
                this.separator = '~';
                this.breadcrumbs = [''];
                if ($stateParams.breadcrumbs) {
                    this.breadcrumbs = $stateParams.breadcrumbs.split(this.separator);
                }
            }
            Breadcrumb.prototype.back = function (params) {
                var lastState = this.breadcrumbs.pop();
                params.breadcrumbs = this.breadcrumbs.join(this.separator);
                return lastState;
            };
            Breadcrumb.prototype.forward = function (params, toState) {
                var copy = this.breadcrumbs.slice(0);
                copy.push(toState);
                params.breadcrumbs = copy.join(this.separator);
                return toState;
            };
            Breadcrumb.prototype.addCrumb = function (state) {
                this.breadcrumbs.push(state);
            };
            return Breadcrumb;
        })();
        common.Breadcrumb = Breadcrumb;
    })(common = to.common || (to.common = {}));
})(to || (to = {}));
//# sourceMappingURL=Breadcrumb.js.map