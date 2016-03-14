var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var enter;
    (function (enter) {
        var EnterMotivationController = (function (_super) {
            __extends(EnterMotivationController, _super);
            function EnterMotivationController($ionicHistory, $scope, $state, $stateParams, actionRepository, actionService, motivationRepository) {
                var _this = this;
                _super.call(this, $ionicHistory, $scope, $state, 'EnterMotivationController', 'New Reason');
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.actionService = actionService;
                this.motivationRepository = motivationRepository;
                if ($stateParams.actionId) {
                    actionRepository.get($stateParams.actionId).then(function (action) {
                        _this.action = action;
                    });
                }
                this.motivation = {
                    comments: [],
                    description: '',
                    helpLevel: 3,
                    impact: 3,
                    avgActionPriority: 0,
                    avgTimeInPlanning: 0,
                    avgTimeInReady: 0,
                    avgTimeInProgress: 0,
                    avgCompletionTime: 0,
                    numActions: 0,
                    numCanceledActions: 0,
                    numCompleteActions: 0,
                    numInProgressActions: 0,
                    numPlannedActions: 0,
                    numReadyActions: 0,
                    numRevertedActions: 0,
                    positive: true,
                    type: 'motivation'
                };
            }
            EnterMotivationController.prototype.getConditionLabel = function () {
                var condition = 'do it';
                if (this.action && this.action.phrase) {
                    condition = this.action.phrase;
                }
                return _super.prototype.getConditionLabel.call(this, condition);
            };
            EnterMotivationController.prototype.saveMotivation = function () {
                var _this = this;
                if (this.comment) {
                    this.motivation.comments.push(this.comment);
                }
                this.motivationRepository.save(this.motivation).then(function () {
                    if (_this.action) {
                        _this.actionService.addMotivation(_this.action, _this.motivation);
                    }
                    _this.back();
                });
            };
            EnterMotivationController.prototype.saveMotivationLabel = function () {
                return 'Enter';
            };
            return EnterMotivationController;
        })(to.common.MotivationController);
        angular.module('organizator').controller('EnterMotivationController', EnterMotivationController);
    })(enter = to.enter || (to.enter = {}));
})(to || (to = {}));
//# sourceMappingURL=EnterMotivationController.js.map