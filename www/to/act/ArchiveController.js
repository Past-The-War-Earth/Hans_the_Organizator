var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var act;
    (function (act) {
        var ArchiveController = (function (_super) {
            __extends(ArchiveController, _super);
            function ArchiveController($ionicHistory, $scope, $state, $stateParams, archiveRepository, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'ArchiveController', 'Archive');
                this.$stateParams = $stateParams;
                this.archiveRepository = archiveRepository;
                this.categoryRepository = categoryRepository;
                this.motivationRepository = motivationRepository;
                this.reload();
            }
            ArchiveController.prototype.reload = function () {
                var _this = this;
                return _super.prototype.reload.call(this).then(function () {
                    return _this.archiveRepository.getAll()
                        .then(function (actions) {
                        _this.actions = actions;
                        _this.afterDataLoad();
                    });
                });
            };
            ArchiveController.prototype.selectAction = function (action) {
                var params = {
                    actionId: action._id,
                    archive: 'Y'
                };
                this.$state.go(to.common.states.VIEW_ACTION, params);
            };
            return ArchiveController;
        })(to.common.ActionsController);
        angular.module('organizator').controller('ArchiveController', ArchiveController);
    })(act = to.act || (to.act = {}));
})(to || (to = {}));
//# sourceMappingURL=ArchiveController.js.map