var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var edit;
    (function (edit) {
        var AddAfterActionsToActionController = (function (_super) {
            __extends(AddAfterActionsToActionController, _super);
            function AddAfterActionsToActionController($ionicActionSheet, $ionicHistory, $scope, $state, $stateParams, actionRepository, actionService, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'AddAfterActionsToActionController', 'Add Do After');
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
            AddAfterActionsToActionController.prototype.reload = function () {
                var _this = this;
                return this.actionRepository.get(this.$stateParams.actionId).then(function (action) {
                    _this.action = action;
                    _this.actionService.getCandidatesForAfterAction(action, _this.categoryFilter, _this.motivationFilter, _this.adviceFilter).then(function (candidateActions) {
                        _this.beforeActions = candidateActions;
                        _this.afterDataLoad();
                    });
                });
            };
            AddAfterActionsToActionController.prototype.filter = function () {
                var _this = this;
                this.actionService.getCandidatesForAfterAction(this.action, this.categoryFilter, this.motivationFilter, this.adviceFilter).then(function (candidateActions) {
                    _this.beforeActions = candidateActions;
                    _this.$scope.$apply();
                });
            };
            AddAfterActionsToActionController.prototype.toggleCategoryFilter = function () {
                this.categoryFilter = !this.categoryFilter;
                this.setBackgrounds(false, this.categoryFilter, false);
                this.filter();
            };
            AddAfterActionsToActionController.prototype.toggleMotivationFilter = function () {
                this.motivationFilter = !this.motivationFilter;
                this.setBackgrounds(this.motivationFilter, false, false);
                this.filter();
            };
            AddAfterActionsToActionController.prototype.setBackgrounds = function (reasons, categories, advise) {
                this.toggleMotivationBackgroundClass['background-reasons'] = reasons;
                this.toggleCategoryBackgroundClass['background-categories'] = categories;
                this.toggleAdviseBackgroundClass['background-advise'] = advise;
            };
            AddAfterActionsToActionController.prototype.toggleAdviseFilter = function () {
                this.adviceFilter = !this.adviceFilter;
                this.setBackgrounds(false, false, this.adviceFilter);
                this.filter();
            };
            AddAfterActionsToActionController.prototype.canRemoveAfterAction = function (action) {
                return false;
            };
            AddAfterActionsToActionController.prototype.selectAction = function (action) {
                var _this = this;
                this.actionService.addAfterAction(this.action, action).then(function () {
                    _this.back();
                });
            };
            AddAfterActionsToActionController.prototype.getNoEarlierStepsMessage = function () {
                return 'No Earlier steps available';
            };
            return AddAfterActionsToActionController;
        })(to.common.ActionsController);
        edit.AddAfterActionsToActionController = AddAfterActionsToActionController;
        angular.module('organizator').controller('AddAfterActionsToActionController', AddAfterActionsToActionController);
    })(edit = to.edit || (to.edit = {}));
})(to || (to = {}));
//# sourceMappingURL=AddAfterActionsToActionController.js.map