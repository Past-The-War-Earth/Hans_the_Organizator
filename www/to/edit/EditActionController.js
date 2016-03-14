var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var enter;
    (function (enter) {
        var EditActionController = (function (_super) {
            __extends(EditActionController, _super);
            function EditActionController($ionicHistory, $scope, $state, $stateParams, actionRepository, actionService, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, actionService, categoryRepository, motivationRepository, 'EditActionController', 'Action');
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.reload();
            }
            EditActionController.prototype.reload = function () {
                var _this = this;
                return _super.prototype.reload.call(this).then(function () {
                    _this.actionRepository.get(_this.$stateParams.actionId).then(function (action) {
                        _this.action = action;
                        if (!_this.action) {
                            return;
                        }
                        to.common.setDueValueAndUrgency(_this, _this.action);
                        var operations = [
                            _this.categoryRepository.getAllByIds(_this.action.categoryIds),
                            _this.motivationRepository.getAllByIds(_this.action.motivationIds),
                            _this.actionRepository.getAllByIds(_this.action.beforeActionIds),
                            _this.actionRepository.getAllByIds(_this.action.afterActionIds)];
                        Promise.all(operations).then(function (results) {
                            _this.categories = results[0];
                            _this.motivations = results[1];
                            _this.beforeActions = results[2];
                            _this.afterActions = results[3];
                            _this.afterDataLoad();
                            var unbindHandler = _this.$scope.$on('$ionicView.beforeLeave', function (event, stateParams) {
                                _this.convertRanges();
                                _this.actionRepository.update(_this.action);
                                unbindHandler();
                            });
                        });
                    });
                });
            };
            EditActionController.prototype.operateOnAction = function () {
                var _this = this;
                this.convertRanges();
                this.actionRepository.update(this.action).then(function () {
                    _this.back();
                });
            };
            EditActionController.prototype.operateOnActionLabel = function () {
                return 'Save';
            };
            return EditActionController;
        })(to.common.EditableActionController);
        angular.module('organizator').controller('EditActionController', EditActionController);
    })(enter = to.enter || (to.enter = {}));
})(to || (to = {}));
//# sourceMappingURL=EditActionController.js.map