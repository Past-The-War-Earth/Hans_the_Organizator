var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var enter;
    (function (enter) {
        var EnterActionController = (function (_super) {
            __extends(EnterActionController, _super);
            function EnterActionController($ionicHistory, $scope, $state, $stateParams, actionRepository, actionService, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, actionService, categoryRepository, motivationRepository, 'EnterActionController', $stateParams.brandNew === 'Y' ? 'New Action' : 'Copy Action');
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                if ($stateParams.brandNew === 'Y') {
                    actionRepository.setBrandNewAction();
                }
                this.reload();
            }
            EnterActionController.prototype.getTitle = function (brandNew) {
                return brandNew ? 'Enter Action' : 'Copy Action';
            };
            EnterActionController.prototype.reload = function () {
                var _this = this;
                this.action = this.actionRepository.getBrandNewAction();
                var operations = [
                    this.categoryRepository.getAllByIds(this.action.categoryIds),
                    this.motivationRepository.getAllByIds(this.action.motivationIds)];
                return Promise.all(operations).then(function (results) {
                    _this.categories = results[0];
                    _this.motivations = results[1];
                    _this.beforeActions = [];
                    _this.afterActions = [];
                    _this.afterDataLoad();
                });
            };
            EnterActionController.prototype.operateOnAction = function () {
                var _this = this;
                this.convertRanges();
                this.actionRepository.save(this.action).then(function () {
                    if (_this.$stateParams.brandNew === 'Y') {
                        _this.back();
                    }
                    else {
                        _this.doneModifying();
                        _this.$state.go(to.common.states.PLANS);
                    }
                });
            };
            EnterActionController.prototype.operateOnActionLabel = function () {
                return 'Enter';
            };
            return EnterActionController;
        })(to.common.EditableActionController);
        angular.module('organizator').controller('EnterActionController', EnterActionController);
    })(enter = to.enter || (to.enter = {}));
})(to || (to = {}));
//# sourceMappingURL=EnterActionController.js.map