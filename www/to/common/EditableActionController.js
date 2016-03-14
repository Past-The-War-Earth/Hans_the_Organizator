///<reference path="../imports.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by artem on 3/27/15.
 */
var to;
(function (to) {
    var common;
    (function (common) {
        var EditableActionController = (function (_super) {
            __extends(EditableActionController, _super);
            function EditableActionController($ionicHistory, $scope, $state, actionService, categoryRepository, motivationRepository, name, title) {
                _super.call(this, $ionicHistory, $scope, $state, actionService, categoryRepository, motivationRepository, name, title);
                this.dueValue = 1;
                this.dueRemainderDays = 0;
                this.urgency = 2;
            }
            EditableActionController.prototype.getPriorityModeButtonIcon = function () {
                if (!this.action) {
                    return '';
                }
                return this.action.verbBased ? 'fa-user' : 'fa-university';
            };
            EditableActionController.prototype.getEntryMode = function () {
                if (!this.action) {
                    return '';
                }
                return this.action.verbBased ? 'Quick Entry' : 'Detailed Entry';
            };
            EditableActionController.prototype.togglePriorityMode = function () {
                this.action.verbBased = !this.action.verbBased;
            };
            EditableActionController.prototype.getUrgencyModeButtonIcon = function () {
                if (!this.action) {
                    return '';
                }
                // TODO: add calendar mode icon (to switch to estimation based)
                return this.action.estimationBased ? 'fa-calculator' : 'fa-calendar';
            };
            EditableActionController.prototype.toggleUrgencyMode = function () {
                this.action.estimationBased = !this.action.estimationBased;
            };
            EditableActionController.prototype.getDuePeriod = function () {
                if (!this.action) {
                    return 'N/A';
                }
                var prefix = '';
                if (this.urgency == this.Urgency.Weeks || this.urgency == this.Urgency.Years) {
                    prefix = '<b>~</b> ';
                }
                var primaryPeriod = _super.prototype.getInputValue.call(this, to.common.getUrgencyLabel(this.urgency));
                if (this.dueRemainderDays) {
                    primaryPeriod += " and " + prefix + this.dueRemainderDays + " days";
                }
                return primaryPeriod;
            };
            EditableActionController.prototype.getUrgencyIcon = function () {
                return to.common.getUrgencyInlineIcon(this.urgency);
            };
            EditableActionController.prototype.dueEstimationChanged = function () {
                this.action.dueDate = to.common.getActionDueDate(this);
            };
            EditableActionController.prototype.dueDateChanged = function () {
                // Convert to day only
                this.action.dueDate = new Date(this.action.dueDate.getFullYear(), this.action.dueDate.getMonth(), this.action.dueDate.getDate());
                to.common.setDueValueAndUrgency(this, this.action);
            };
            EditableActionController.prototype.searchCategories = function () {
                var params = {
                    actionId: this.action._id
                };
                this.$state.go(to.common.states.EDIT_CATEGORIES_FOR_ACTION, params);
            };
            EditableActionController.prototype.searchMotivations = function () {
                var params = {
                    actionId: this.action._id
                };
                this.$state.go(to.common.states.EDIT_MOTIVATIONS_FOR_ACTION, params);
            };
            EditableActionController.prototype.convertRanges = function () {
                if (this.urgency == this.Urgency.Now) {
                    this.dueValue = 1;
                }
                this.action.dueDate = to.common.getActionDueDate(this);
            };
            EditableActionController.prototype.convertPropertyToNumber = function (propertyName) {
                if (typeof this.action[propertyName] === 'string') {
                    this.action[propertyName] = parseInt(this.action[propertyName]);
                }
            };
            EditableActionController.prototype.removeCategory = function (index) {
                this.categories.splice(index, 1);
                this.action.categoryIds.splice(index, 1);
            };
            EditableActionController.prototype.removeMotivation = function (index) {
                this.motivations.splice(index, 1);
                this.action.motivationIds.splice(index, 1);
            };
            EditableActionController.prototype.addBeforeAction = function () {
                var params = {
                    actionId: this.action._id
                };
                this.$state.go(to.common.states.ADD_BEFORE_ACTIONS, params);
            };
            EditableActionController.prototype.addAfterAction = function () {
                var params = {
                    actionId: this.action._id
                };
                this.$state.go(to.common.states.ADD_AFTER_ACTIONS, params);
            };
            return EditableActionController;
        }(common.ActionController));
        common.EditableActionController = EditableActionController;
    })(common = to.common || (to.common = {}));
})(to || (to = {}));
//# sourceMappingURL=EditableActionController.js.map