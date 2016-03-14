var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var enter;
    (function (enter) {
        var AddMotivationsToActionController = (function (_super) {
            __extends(AddMotivationsToActionController, _super);
            function AddMotivationsToActionController($ionicActionSheet, $ionicHistory, $scope, $state, $stateParams, actionRepository, actionService, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, 'AddMotivationsToActionController', 'Add Reason');
                this.$ionicActionSheet = $ionicActionSheet;
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.actionService = actionService;
                this.motivationRepository = motivationRepository;
                this.reload();
            }
            AddMotivationsToActionController.prototype.reload = function () {
                var _this = this;
                this.actionRepository.get(this.$stateParams.actionId).then(function (action) {
                    _this.action = action;
                    var operations = [_this.motivationRepository.getAllByIds(_this.action.motivationIds),
                        _this.motivationRepository.getAll()];
                    Promise.all(operations).then(function (results) {
                        _this.motivations = results[0];
                        var inActionMotivationMap = {};
                        _this.motivations.forEach(function (motivation) {
                            inActionMotivationMap[motivation._id] = true;
                        });
                        _this.otherMotivations = results[1].filter(function (motivation) {
                            return !inActionMotivationMap[motivation._id];
                        });
                        _this.afterDataLoad();
                    });
                });
            };
            AddMotivationsToActionController.prototype.addMotivation = function () {
                var params = {
                    actionId: this.$stateParams.actionId
                };
                this.$state.go(to.common.states.ENTER_MOTIVATION, params);
            };
            AddMotivationsToActionController.prototype.addMotivationToAction = function (motivation) {
                this.actionService.addMotivation(this.action, motivation);
                this.back();
            };
            AddMotivationsToActionController.prototype.editMotivation = function (motivation) {
                var params = {
                    actionId: this.$stateParams.actionId,
                    id: motivation._id
                };
                this.$state.go(to.common.states.EDIT_MOTIVATION, params);
            };
            AddMotivationsToActionController.prototype.selectMotivationActionSheet = function (motivation) {
                var _this = this;
                this.$ionicActionSheet.show({
                    buttons: [
                        { text: 'Edit' },
                        { text: 'Add to Action' }
                    ],
                    titleText: motivation.description,
                    cancelText: 'Cancel',
                    buttonClicked: function (index) {
                        switch (index) {
                            case 0:
                                _this.editMotivation(motivation);
                                break;
                            case 1:
                                _this.actionService.addMotivation(_this.action, motivation);
                                _this.motivations.push(motivation);
                                for (var i = 0; i < _this.otherMotivations.length; i++) {
                                    if (_this.otherMotivations[i]._id == motivation._id) {
                                        _this.otherMotivations.splice(i, 1);
                                    }
                                }
                                _this.back();
                                break;
                        }
                        return true;
                    }
                });
            };
            AddMotivationsToActionController.prototype.deselectMotivationActionSheet = function (motivation) {
                var _this = this;
                this.$ionicActionSheet.show({
                    buttons: [
                        { text: 'Edit' }
                    ],
                    destructiveText: 'Remove from Action',
                    titleText: motivation.description,
                    cancelText: 'Cancel',
                    buttonClicked: function (index) {
                        _this.editMotivation(motivation);
                        return true;
                    },
                    destructiveButtonClicked: function () {
                        for (var i = 0; i < _this.motivations.length; i++) {
                            if (_this.motivations[i]._id == motivation._id) {
                                _this.motivations.splice(i, 1);
                            }
                        }
                        _this.actionService.removeMotivation(_this.action, motivation);
                        _this.otherMotivations.push(motivation);
                        _this.back();
                        return true;
                    }
                });
            };
            return AddMotivationsToActionController;
        })(to.common.BranchComponent);
        angular.module('organizator').controller('AddMotivationsToActionController', AddMotivationsToActionController);
    })(enter = to.enter || (to.enter = {}));
})(to || (to = {}));
//# sourceMappingURL=AddMotivationsToActionController.js.map