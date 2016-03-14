///<reference path="../imports.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by artem on 4/4/15.
 */
var to;
(function (to) {
    var common;
    (function (common) {
        var MotivationController = (function (_super) {
            __extends(MotivationController, _super);
            // If don't/do 'the action' then what?
            // what that motivates you will/won't happen?
            function MotivationController($ionicHistory, $scope, $state, name, title) {
                _super.call(this, $ionicHistory, $scope, $state, name, title);
            }
            MotivationController.prototype.getConditionLabel = function (condition) {
                if (!this.motivation) {
                    return 'N/A';
                }
                if (this.motivation.positive) {
                    return "If you " + condition;
                }
                else {
                    return "If you don't " + condition;
                }
            };
            MotivationController.prototype.getOutcomeLevelLabel = function () {
                if (!this.motivation) {
                    return 'N/A';
                }
                if (this.motivation.positive) {
                    return 'How Good would it be? ' + to.common.getPositiveImpactLabel(this.motivation.impact);
                }
                else {
                    return 'How Bad would it be? ' + to.common.getNegativeImpactLabel(this.motivation.impact);
                }
            };
            MotivationController.prototype.getMotivationImpact = function () {
                var impact = 'N/A';
                if (this.motivation) {
                    if (this.motivation.positive) {
                        impact = to.common.getPositiveImpactLabel(this.motivation.impact);
                    }
                    else {
                        impact = to.common.getNegativeImpactLabel(this.motivation.impact);
                    }
                }
                return this.getInputValue(impact);
            };
            MotivationController.prototype.getCoachingLabel = function () {
                var coaching = 'N/A';
                if (this.motivation) {
                    coaching = to.common.getCoachingLabel(this.motivation.helpLevel);
                }
                return this.getInputValue(coaching);
            };
            MotivationController.prototype.toggleImpactMode = function () {
                this.motivation.positive = !this.motivation.positive;
            };
            MotivationController.prototype.getImpactModeButtonIcon = function () {
                if (!this.motivation) {
                    return '';
                }
                return this.motivation.positive ? 'fa-thumbs-up' : 'fa-thumbs-down';
            };
            MotivationController.prototype.getMinimumImpactClass = function () {
                if (!this.motivation) {
                    return '';
                }
                return this.motivation.positive ? 'icon-neutral' : 'icon-wondering';
            };
            MotivationController.prototype.getMaximumImpactClass = function () {
                if (!this.motivation) {
                    return '';
                }
                return this.motivation.positive ? 'icon-grin' : 'icon-crying';
            };
            return MotivationController;
        }(common.BranchComponent));
        common.MotivationController = MotivationController;
    })(common = to.common || (to.common = {}));
})(to || (to = {}));
//# sourceMappingURL=MotivationController.js.map