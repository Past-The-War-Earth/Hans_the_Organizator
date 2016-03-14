///<reference path="../imports.ts"/>
/**
 * Created by artem on 4/9/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var enter;
    (function (enter) {
        var EditMotivationController = (function (_super) {
            __extends(EditMotivationController, _super);
            function EditMotivationController($ionicHistory, $scope, $state, $stateParams, motivationRepository) {
                var _this = this;
                _super.call(this, $ionicHistory, $scope, $state, 'EditMotivationController', 'Reason');
                this.$stateParams = $stateParams;
                this.motivationRepository = motivationRepository;
                this.inEditMode = true;
                motivationRepository.get($stateParams.id).then(function (motivation) {
                    _this.motivation = motivation;
                    var unbindHandler = $scope.$on('$ionicView.beforeLeave', function () {
                        _this.motivationRepository.update(_this.motivation);
                        unbindHandler();
                    });
                    _this.afterDataLoad();
                });
            }
            EditMotivationController.prototype.saveMotivation = function () {
                var _this = this;
                this.motivationRepository.update(this.motivation).then(function () {
                    _this.back();
                });
            };
            EditMotivationController.prototype.saveMotivationLabel = function () {
                return 'Save';
            };
            return EditMotivationController;
        }(to.common.MotivationController));
        angular.module('organizator').controller('EditMotivationController', EditMotivationController);
    })(enter = to.enter || (to.enter = {}));
})(to || (to = {}));
//# sourceMappingURL=EditMotivationController.js.map