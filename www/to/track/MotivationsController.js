var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var enter;
    (function (enter) {
        var MotivationsController = (function (_super) {
            __extends(MotivationsController, _super);
            function MotivationsController($ionicHistory, $ionicPopup, $scope, $state, $stateParams, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, 'MotivationsController', 'Reasons');
                this.$ionicPopup = $ionicPopup;
                this.$stateParams = $stateParams;
                this.motivationRepository = motivationRepository;
                this.reload();
            }
            MotivationsController.prototype.reload = function () {
                var _this = this;
                this.motivationRepository.getByParameters(this.$stateParams.urgencies, this.$stateParams.priorities, this.$stateParams.kanbanState, this.$stateParams.categoryId).then(function (motivations) {
                    _this.motivations = motivations;
                    _this.sorter = new to.common.sort.MotivationSorter(_this.$ionicPopup, _this.$scope, _this.motivations, {
                        sortBy: 'NAME',
                        ascending: true
                    });
                    _this.afterDataLoad();
                });
            };
            MotivationsController.prototype.addMotivation = function () {
                this.$state.go(to.common.states.ENTER_MOTIVATION);
            };
            MotivationsController.prototype.selectMotivation = function (motivation) {
                this.$stateParams.motivationId = motivation._id;
                this.$state.go(to.common.states.VIEW_MOTIVATION, this.$stateParams);
            };
            MotivationsController.prototype.listActions = function (motivation) {
                this.$state.go(to.common.states.LIST_ACTIONS, this.$stateParams);
            };
            return MotivationsController;
        })(to.common.BranchComponent);
        angular.module('organizator').controller('MotivationsController', MotivationsController);
    })(enter = to.enter || (to.enter = {}));
})(to || (to = {}));
//# sourceMappingURL=MotivationsController.js.map