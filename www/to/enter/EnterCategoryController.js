var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var enter;
    (function (enter) {
        var EnterCategoryController = (function (_super) {
            __extends(EnterCategoryController, _super);
            function EnterCategoryController($ionicHistory, $scope, $state, $stateParams, actionRepository, actionService, categoryRepository) {
                var _this = this;
                _super.call(this, $ionicHistory, $scope, $state, 'EnterCategoryController', 'New Category');
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.actionService = actionService;
                this.categoryRepository = categoryRepository;
                if ($stateParams.actionId) {
                    actionRepository.get($stateParams.actionId).then(function (action) {
                        _this.action = action;
                        _this.afterDataLoad();
                    });
                }
                this.category = {
                    avgActionPriority: 0,
                    avgCompletionTime: 0,
                    avgTimeInPlanning: 0,
                    avgTimeInProgress: 0,
                    avgTimeInReady: 0,
                    helpLevel: 3,
                    name: '',
                    numActions: 0,
                    numCanceledActions: 0,
                    numCompleteActions: 0,
                    numInProgressActions: 0,
                    numPlannedActions: 0,
                    numReadyActions: 0,
                    numRevertedActions: 0,
                    priority: "3",
                    type: 'category'
                };
            }
            EnterCategoryController.prototype.saveCategory = function () {
                var _this = this;
                this.categoryRepository.save(this.category).then(function () {
                    if (_this.action) {
                        _this.actionService.addCategory(_this.action, _this.category);
                    }
                    _this.back();
                });
            };
            EnterCategoryController.prototype.saveCategoryLabel = function () {
                return 'Enter';
            };
            return EnterCategoryController;
        })(to.common.CategoryController);
        angular.module('organizator').controller('EnterCategoryController', EnterCategoryController);
    })(enter = to.enter || (to.enter = {}));
})(to || (to = {}));
//# sourceMappingURL=EnterCategoryController.js.map