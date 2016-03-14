///<reference path="../imports.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by artem on 4/24/15.
 */
var to;
(function (to) {
    var common;
    (function (common) {
        var ActionController = (function (_super) {
            __extends(ActionController, _super);
            function ActionController($ionicHistory, $scope, $state, actionService, categoryRepository, motivationRepository, name, title) {
                _super.call(this, $ionicHistory, $scope, $state, categoryRepository, motivationRepository, name, title);
                this.actionService = actionService;
                this.actionOptions = [
                    'Could',
                    'Would like to',
                    'Should',
                    'Must',
                    'Need to'
                ];
            }
            ActionController.prototype.getActionLabel = function () {
                if (!this.action) {
                    return 'N/A';
                }
                var icon = to.common.getPriorityInlineIcon(this.action);
                if (this.action.verbBased) {
                    return icon + ' ' + _super.prototype.getInputValue.call(this, "I " + this.actionOptions[this.action.priority]);
                }
                else {
                    return icon + ' ' + _super.prototype.getInputValue.call(this, "It is " + to.common.getPriorityLabel(this.action.priority));
                }
            };
            ActionController.prototype.getPriorityVerb = function () {
                if (!this.action) {
                    return 'N/A';
                }
                var icon = to.common.getPriorityInlineIcon(this.action);
                return icon + _super.prototype.getInputValue.call(this, "I " + this.actionOptions[this.action.priority]);
            };
            ActionController.prototype.asPartOfLabel = function () {
                if (!this.categories) {
                    return 'N/A';
                }
                var labelPrefix = 'As part of ';
                if (this.categories.length) {
                    return labelPrefix + _super.prototype.getInputValue.call(this, this.getCategoryList());
                }
                else {
                    return labelPrefix + 'what?';
                }
            };
            ActionController.prototype.getCategoryList = function () {
                if (!this.categories) {
                    return 'N/A';
                }
                if (this.categories.length === 0) {
                    return '';
                }
                return this.categories.map(function (category) {
                    return category.name;
                }).reduce(function (labelSuffix, categoryName) {
                    return labelSuffix + ', ' + categoryName;
                });
            };
            ActionController.prototype.getKanbanLabel = function () {
                if (!this.action) {
                    return 'State: N/A';
                }
                return "State: " + _super.prototype.getInputValue.call(this, to.common.getKanbanState(this.action.kanbanState));
            };
            ActionController.prototype.getMotivationsList = function () {
                if (!this.motivations) {
                    return 'N/A';
                }
                if (this.motivations.length === 0) {
                    return '';
                }
                return this.motivations.map(function (motivation) {
                    return motivation.description;
                }).reduce(function (labelSuffix, motivationName) {
                    return labelSuffix + ', ' + motivationName;
                });
            };
            ActionController.prototype.canRemoveBeforeAction = function (doBeforeAction) {
                return this.actionIsNotDone(doBeforeAction);
            };
            ActionController.prototype.removeBeforeAction = function (doBeforeAction) {
                this.actionService.removeBeforeAction(this.action, doBeforeAction);
            };
            ActionController.prototype.canRemoveAfterAction = function (doAfterAction) {
                return this.actionIsNotDone(doAfterAction);
            };
            ActionController.prototype.removeAfterAction = function (doAfterAction) {
                this.actionService.removeAfterAction(this.action, doAfterAction);
            };
            ActionController.prototype.getNoLaterStepsMessage = function () {
                return 'No Later steps';
            };
            ActionController.prototype.getNoEarlierStepsMessage = function () {
                return 'No Earlier steps';
            };
            return ActionController;
        }(to.common.ActionsController));
        common.ActionController = ActionController;
    })(common = to.common || (to.common = {}));
})(to || (to = {}));
//# sourceMappingURL=ActionController.js.map