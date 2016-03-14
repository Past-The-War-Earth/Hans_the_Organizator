var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var enter;
    (function (enter) {
        var AddCategoriesToActionController = (function (_super) {
            __extends(AddCategoriesToActionController, _super);
            function AddCategoriesToActionController($ionicActionSheet, $ionicHistory, $scope, $state, $stateParams, actionRepository, actionService, categoryRepository) {
                _super.call(this, $ionicHistory, $scope, $state, 'AddCategoriesToActionController', 'Add Category');
                this.$ionicActionSheet = $ionicActionSheet;
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.actionService = actionService;
                this.categoryRepository = categoryRepository;
                this.reload();
            }
            AddCategoriesToActionController.prototype.reload = function () {
                var _this = this;
                this.actionRepository.get(this.$stateParams.actionId).then(function (action) {
                    _this.action = action;
                    var operations = [_this.categoryRepository.getAllByIds(_this.action.categoryIds),
                        _this.categoryRepository.getAll()];
                    Promise.all(operations).then(function (results) {
                        _this.categories = results[0];
                        var inActionCategoryMap = {};
                        _this.categories.forEach(function (category) {
                            inActionCategoryMap[category._id] = true;
                        });
                        _this.otherCategories = results[1].filter(function (category) {
                            return !inActionCategoryMap[category._id];
                        });
                        _this.afterDataLoad();
                    });
                });
            };
            AddCategoriesToActionController.prototype.addCategory = function () {
                var params = {
                    actionId: this.$stateParams.actionId
                };
                this.$state.go(to.common.states.ENTER_CATEGORY, params);
            };
            AddCategoriesToActionController.prototype.addCategoryToAction = function (category) {
                this.actionService.addCategory(this.action, category);
                this.back();
            };
            AddCategoriesToActionController.prototype.editCategory = function (category) {
                var params = {
                    actionId: this.$stateParams.actionId,
                    id: category._id
                };
                this.$state.go(to.common.states.EDIT_CATEGORY, params);
            };
            AddCategoriesToActionController.prototype.selectCategoryActionSheet = function (category) {
                var _this = this;
                this.$ionicActionSheet.show({
                    buttons: [
                        { text: 'Edit' },
                        { text: 'Add to Action' }
                    ],
                    titleText: category.name,
                    cancelText: 'Cancel',
                    buttonClicked: function (index) {
                        switch (index) {
                            case 0:
                                _this.editCategory(category);
                                break;
                            case 1:
                                _this.actionService.addCategory(_this.action, category);
                                _this.categories.push(category);
                                for (var i = 0; i < _this.otherCategories.length; i++) {
                                    if (_this.otherCategories[i]._id == category._id) {
                                        _this.otherCategories.splice(i, 1);
                                    }
                                }
                                _this.back();
                                break;
                        }
                        return true;
                    }
                });
            };
            AddCategoriesToActionController.prototype.deselectCategoryActionSheet = function (category) {
                var _this = this;
                this.$ionicActionSheet.show({
                    buttons: [
                        { text: 'Edit' }
                    ],
                    destructiveText: 'Remove from Action',
                    titleText: category.name,
                    cancelText: 'Cancel',
                    buttonClicked: function (index) {
                        _this.editCategory(category);
                        return true;
                    },
                    destructiveButtonClicked: function () {
                        for (var i = 0; i < _this.categories.length; i++) {
                            if (_this.categories[i]._id == category._id) {
                                _this.categories.splice(i, 1);
                            }
                        }
                        _this.actionService.removeCategory(_this.action, category);
                        _this.otherCategories.push(category);
                        _this.back();
                        return true;
                    }
                });
            };
            AddCategoriesToActionController.prototype.filterCategories = function (searchString) {
            };
            return AddCategoriesToActionController;
        })(to.common.BranchComponent);
        angular.module('organizator').controller('AddCategoriesToActionController', AddCategoriesToActionController);
    })(enter = to.enter || (to.enter = {}));
})(to || (to = {}));
//# sourceMappingURL=AddCategoriesToActionController.js.map