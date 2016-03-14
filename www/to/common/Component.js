///<reference path="../imports.ts"/>
/**
 * Created by artem on 3/29/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var common;
    (function (common) {
        var Component = (function () {
            function Component($scope, $state, name, viewTitle) {
                this.$scope = $scope;
                this.$state = $state;
                this.Kanban = to.common.Kanban;
                this.Priority = to.common.Priority;
                this.Urgency = to.common.Urgency;
                this.logger = new common.Logger(name);
                this.name = name;
                this.viewTitle = viewTitle;
                to.common.setTheme(viewTitle);
            }
            Component.prototype.afterDataLoad = function () {
                this.$scope.$apply();
                setTimeout(function () {
                    jQuery('.org-back-button').show();
                    autosize(jQuery('textarea'));
                }, 100);
            };
            Component.prototype.getInputValue = function (value) {
                return "<span class=\"to-value\">" + value + "</span>";
            };
            Component.prototype.listen = function (event, callback) {
                common.pEventBus.listen(event, this, callback);
            };
            Component.prototype.fire = function (event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                common.pEventBus.fire(event, args);
            };
            Component.prototype.getCategoryPriorityClass = function (category, diffSize) {
                if (!category) {
                    return '';
                }
                return to.common.getPriorityClass(category.priority, diffSize);
            };
            Component.prototype.getCategoryCoachingClass = function (category) {
                if (!category) {
                    return '';
                }
                return to.common.getCoachingClass(category.helpLevel);
            };
            Component.prototype.getCategoryTeacherPhrase = function (category) {
                if (!category) {
                    return '';
                }
                return to.common.getCoachingLabel(category.helpLevel);
            };
            Component.prototype.getMotivationImpactClass = function (motivation) {
                if (!motivation) {
                    return '';
                }
                return to.common.getImpactClass(motivation);
            };
            Component.prototype.getMotivationCoachingClass = function (motivation) {
                if (!motivation) {
                    return '';
                }
                return to.common.getCoachingClass(motivation.helpLevel);
            };
            Component.prototype.getMotivationTeacherPhrase = function (motivation) {
                if (!motivation) {
                    return '';
                }
                return to.common.getCoachingLabel(motivation.helpLevel);
            };
            Component.prototype.getUrgencyClass = function (action) {
                return to.common.getUrgencyClass(to.common.getUrgencyOfAction(action));
            };
            Component.prototype.getPriorityClass = function (action) {
                return to.common.getPriorityClass(action.priority);
            };
            Component.prototype.actionIsNotDone = function (action) {
                return action.kanbanState != this.Kanban.RecentlyDone && action.kanbanState != this.Kanban.Archived;
            };
            Component.prototype.editAction = function (action) {
                this.$state.go(to.common.states.EDIT_ACTION, { actionId: action._id });
            };
            return Component;
        }());
        common.Component = Component;
        /**
         * You can only go back from a leaf component.
         */
        var LeafComponent = (function (_super) {
            __extends(LeafComponent, _super);
            function LeafComponent() {
                _super.apply(this, arguments);
            }
            LeafComponent.prototype.back = function () {
                this.fire(common.Event.DONE_MODIFYING);
                window.history.back();
            };
            return LeafComponent;
        }(Component));
        common.LeafComponent = LeafComponent;
        /**
         * You can go to other views from a branch component
         */
        var BranchComponent = (function (_super) {
            __extends(BranchComponent, _super);
            function BranchComponent($ionicHistory, $scope, $state, name, viewTitle) {
                _super.call(this, $scope, $state, name, viewTitle);
                this.$ionicHistory = $ionicHistory;
                this.listen(common.Event.DONE_MODIFYING, this.reload);
            }
            BranchComponent.prototype.reload = function (initial) {
                if (initial === void 0) { initial = true; }
                // Reload the data here
            };
            BranchComponent.prototype.back = function () {
                this.doneModifying();
                this.$ionicHistory.goBack();
            };
            BranchComponent.prototype.doneModifying = function () {
                this.fire(common.Event.DONE_MODIFYING, false);
            };
            return BranchComponent;
        }(Component));
        common.BranchComponent = BranchComponent;
    })(common = to.common || (to.common = {}));
})(to || (to = {}));
//# sourceMappingURL=Component.js.map