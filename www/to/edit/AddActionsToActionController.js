///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/7/2016.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var edit;
    (function (edit) {
        var AddActionsToActionController = (function (_super) {
            __extends(AddActionsToActionController, _super);
            function AddActionsToActionController($ionicActionSheet, $ionicHistory, $scope, $state, $stateParams, actionRepository, actionService, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'AddBeforeActionsToActionController', 'Add Do Before');
                this.$ionicActionSheet = $ionicActionSheet;
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.actionService = actionService;
                this.categoryFilter = false;
                this.motivationFilter = false;
                this.adviceFilter = false;
                this.reload();
            }
            AddActionsToActionController.prototype.reload = function () {
                var _this = this;
                return this.actionRepository.get(this.$stateParams.actionId).then(function (action) {
                    _this.action = action;
                    _this.actionService.getCandidatesForBeforeAction(action, _this.categoryFilter, _this.motivationFilter, _this.adviceFilter).then(function (candidateActions) {
                        _this.beforeActions = candidateActions;
                        _this.afterDataLoad();
                    });
                });
            };
            AddActionsToActionController.prototype.filter = function () {
            };
            AddActionsToActionController.prototype.toggleCategoryFilter = function () {
                this.categoryFilter = !this.categoryFilter;
                this.filter();
            };
            AddActionsToActionController.prototype.toggleMotivationFilter = function () {
                this.motivationFilter = !this.motivationFilter;
                this.filter();
            };
            AddActionsToActionController.prototype.toggleAdviceFilter = function () {
                this.adviceFilter = !this.adviceFilter;
                this.filter();
            };
            AddActionsToActionController.prototype.canRemoveBeforeAction = function (action) {
                return false;
            };
            return AddActionsToActionController;
        }(to.common.ActionsController));
        edit.AddActionsToActionController = AddActionsToActionController;
    })(edit = to.edit || (to.edit = {}));
})(to || (to = {}));
//# sourceMappingURL=AddActionsToActionController.js.map