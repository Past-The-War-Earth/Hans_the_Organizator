var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var edit;
    (function (edit) {
        var AddBeforeActionsToActionController = (function (_super) {
            __extends(AddBeforeActionsToActionController, _super);
            function AddBeforeActionsToActionController($ionicActionSheet, $ionicHistory, $scope, $state, $stateParams, actionRepository, actionService, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'AddBeforeActionsToActionController', 'Add Do Before');
                this.$ionicActionSheet = $ionicActionSheet;
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.actionService = actionService;
                this.categoryFilter = false;
                this.motivationFilter = false;
                this.adviceFilter = false;
                this.toggleMotivationBackgroundClass = {};
                this.toggleCategoryBackgroundClass = {};
                this.toggleAdviseBackgroundClass = {};
                this.reload();
            }
            AddBeforeActionsToActionController.prototype.reload = function () {
                var _this = this;
                return this.actionRepository.get(this.$stateParams.actionId).then(function (action) {
                    _this.action = action;
                    _this.actionService.getCandidatesForBeforeAction(action, _this.categoryFilter, _this.motivationFilter, _this.adviceFilter).then(function (candidateActions) {
                        _this.beforeActions = candidateActions;
                        _this.afterDataLoad();
                    });
                });
            };
            AddBeforeActionsToActionController.prototype.filter = function () {
                var _this = this;
                this.actionService.getCandidatesForBeforeAction(this.action, this.categoryFilter, this.motivationFilter, this.adviceFilter).then(function (candidateActions) {
                    _this.beforeActions = candidateActions;
                    _this.$scope.$apply();
                });
            };
            AddBeforeActionsToActionController.prototype.toggleCategoryFilter = function () {
                this.categoryFilter = !this.categoryFilter;
                this.setBackgrounds(false, this.categoryFilter, false);
                this.filter();
            };
            AddBeforeActionsToActionController.prototype.toggleMotivationFilter = function () {
                this.motivationFilter = !this.motivationFilter;
                this.setBackgrounds(this.motivationFilter, false, false);
                this.filter();
            };
            AddBeforeActionsToActionController.prototype.setBackgrounds = function (reasons, categories, advise) {
                this.toggleMotivationBackgroundClass['background-reasons'] = reasons;
                this.toggleCategoryBackgroundClass['background-categories'] = categories;
                this.toggleAdviseBackgroundClass['background-advise'] = advise;
            };
            AddBeforeActionsToActionController.prototype.toggleAdviseFilter = function () {
                this.adviceFilter = !this.adviceFilter;
                this.setBackgrounds(false, false, this.adviceFilter);
                this.filter();
            };
            AddBeforeActionsToActionController.prototype.canRemoveBeforeAction = function (action) {
                return false;
            };
            AddBeforeActionsToActionController.prototype.selectAction = function (action) {
                var _this = this;
                this.actionService.addBeforeAction(this.action, action).then(function () {
                    _this.back();
                });
            };
            AddBeforeActionsToActionController.prototype.getNoLaterStepsMessage = function () {
                return 'No Later steps available';
            };
            return AddBeforeActionsToActionController;
        })(to.common.ActionsController);
        edit.AddBeforeActionsToActionController = AddBeforeActionsToActionController;
        angular.module('organizator').controller('AddBeforeActionsToActionController', AddBeforeActionsToActionController);
    })(edit = to.edit || (to.edit = {}));
})(to || (to = {}));
//# sourceMappingURL=AddBeforeActionsToActionController.js.map