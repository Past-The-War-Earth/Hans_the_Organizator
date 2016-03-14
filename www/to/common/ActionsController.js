///<reference path="../imports.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by artem on 5/3/15.
 */
var to;
(function (to) {
    var common;
    (function (common) {
        var PriorityAccessor = (function () {
            function PriorityAccessor(categoryMap) {
                this.categoryMap = categoryMap;
            }
            PriorityAccessor.prototype.getClass = function (categoryId) {
                var category = this.categoryMap[categoryId];
                return category ? to.common.getPriorityClass(category.priority, false) : '';
            };
            return PriorityAccessor;
        }());
        var ImpactAccessor = (function () {
            function ImpactAccessor(motivationMap) {
                this.motivationMap = motivationMap;
            }
            ImpactAccessor.prototype.getClass = function (motivationId) {
                var motivation = this.motivationMap[motivationId];
                return motivation ? to.common.getImpactClass(motivation) : '';
            };
            return ImpactAccessor;
        }());
        var ActionsController = (function (_super) {
            __extends(ActionsController, _super);
            function ActionsController($ionicHistory, $scope, $state, categoryRepository, motivationRepository, name, viewTitle) {
                _super.call(this, $ionicHistory, $scope, $state, name, viewTitle);
                this.categoryRepository = categoryRepository;
                this.motivationRepository = motivationRepository;
            }
            ActionsController.prototype.reload = function () {
                var _this = this;
                var operations = [this.categoryRepository.getMap(),
                    this.motivationRepository.getMap()];
                return Promise.all(operations).then(function (results) {
                    _this.priority = new PriorityAccessor(results[0]);
                    _this.impact = new ImpactAccessor(results[1]);
                });
            };
            ActionsController.prototype.selectAction = function (action) {
                var params = {
                    actionId: action._id
                };
                this.$state.go(to.common.states.VIEW_ACTION, params);
            };
            return ActionsController;
        }(common.BranchComponent));
        common.ActionsController = ActionsController;
    })(common = to.common || (to.common = {}));
})(to || (to = {}));
//# sourceMappingURL=ActionsController.js.map