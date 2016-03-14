var to;
(function (to) {
    var MainController = (function () {
        function MainController($ionicActionSheet, $scope, $state, bookmarkRepository, categoryRepository, motivationRepository, speechEngine) {
            var _this = this;
            this.$ionicActionSheet = $ionicActionSheet;
            this.$scope = $scope;
            this.$state = $state;
            this.bookmarkRepository = bookmarkRepository;
            this.categoryRepository = categoryRepository;
            this.motivationRepository = motivationRepository;
            this.speechEngine = speechEngine;
            this.deploy = new Ionic.Deploy();
            this.hasUpdate = false;
            this.updateOrCheckInProgress = false;
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                var bookmark = {
                    categoryId: toParams.categoryId,
                    kanbanState: toParams.kanbanState,
                    motivationId: toParams.motivationId,
                    priorities: toParams.priorities,
                    stateName: toState.name,
                    type: 'bookmark',
                    urgencies: toParams.urgencies
                };
                bookmark.hasCategoryFilter = toParams.categoryId && toParams.categoryId != 0;
                bookmark.hasEisenhowerFilter = (toParams.urgencies
                    && toParams.urgencies != to.common.Urgency.All)
                    || (toParams.priorities
                        && toParams.priorities != to.common.Priority.All);
                if (toParams.kanbanState) {
                    switch (parseInt(toParams.kanbanState)) {
                        case to.common.Kanban.Planned:
                            bookmark.hasKanbanPlannedFilter = true;
                            break;
                        case to.common.Kanban.Ready:
                            bookmark.hasKanbanReadyFilter = true;
                            break;
                        case to.common.Kanban.InProgress:
                            bookmark.hasKanbanInProgressFilter = true;
                            break;
                        case to.common.Kanban.RecentlyDone:
                            bookmark.hasKanbanRecentlyDoneFilter = true;
                            break;
                    }
                }
                bookmark.hasMotivationFilter = toParams.motivationId && toParams.motivationId != 0;
                bookmark.hasFilters = bookmark.hasCategoryFilter || bookmark.hasEisenhowerFilter
                    || bookmark.hasKanbanPlannedFilter || bookmark.hasKanbanReadyFilter
                    || bookmark.hasKanbanInProgressFilter || bookmark.hasKanbanRecentlyDoneFilter
                    || bookmark.hasMotivationFilter;
                _this.bookmark = bookmark;
                _this.bookmarkRepository.bookmarkExists(bookmark).then(function (exists) {
                    _this.bookmarkSaved = exists;
                    $scope.$apply();
                });
            });
        }
        MainController.prototype.getUpdateIconClass = function () {
            var classObject = {};
            if (this.updateOrCheckInProgress) {
                classObject['fa-spin'] = true;
            }
            if (this.hasUpdate) {
                classObject['fa-download'] = true;
            }
            else {
                classObject['fa-refresh'] = true;
            }
            return classObject;
        };
        MainController.prototype.onUpdateButtonClick = function () {
            if (this.hasUpdate) {
                this.doUpdate();
            }
            else {
                this.checkForUpdates();
            }
        };
        MainController.prototype.doUpdate = function () {
            var _this = this;
            this.hasUpdate = false;
            this.updateOrCheckInProgress = true;
            this.deploy.update().then(function (res) {
                console.log('Ionic Deploy: Update Success! ', res);
                _this.updateOrCheckInProgress = false;
            }, function (err) {
                console.log('Ionic Deploy: Update error! ', err);
                _this.updateOrCheckInProgress = false;
            }, function (prog) {
                console.log('Ionic Deploy: Progress... ', prog);
            });
        };
        MainController.prototype.checkForUpdates = function () {
            var _this = this;
            this.updateOrCheckInProgress = true;
            console.log('Ionic Deploy: Checking for updates');
            this.deploy.check().then(function (hasUpdate) {
                console.log('Ionic Deploy: Update available: ' + hasUpdate);
                _this.hasUpdate = hasUpdate;
                _this.updateOrCheckInProgress = false;
            }, function (err) {
                _this.updateOrCheckInProgress = false;
                console.error('Ionic Deploy: Unable to check for updates', err);
            });
        };
        MainController.prototype.modifyFilters = function () {
            var _this = this;
            var categoryLabel;
            var motivationLabel;
            var params = this.$state.params;
            var operations = [];
            if (this.bookmark.hasCategoryFilter) {
                operations.push(this.categoryRepository.get(params.categoryId));
            }
            if (this.bookmark.hasMotivationFilter) {
                operations.push(this.motivationRepository.get(params.motivationId));
            }
            if (operations.length) {
                Promise.all(operations).then(function (results) {
                    if (_this.bookmark.hasCategoryFilter) {
                        categoryLabel = results[0].name;
                        if (_this.bookmark.hasMotivationFilter) {
                            motivationLabel = results[1].description;
                        }
                    }
                    else {
                        motivationLabel = results[0].description;
                    }
                    _this.modifyFiltersWithLabels(categoryLabel, motivationLabel);
                });
            }
            else {
                this.modifyFiltersWithLabels(categoryLabel, motivationLabel);
            }
        };
        MainController.prototype.modifyFiltersWithLabels = function (categoryLabel, motivationLabel) {
            var _this = this;
            var params = this.$state.params;
            var buttons = [];
            var indexes = [];
            if (this.bookmark.hasEisenhowerFilter) {
                buttons.push({
                    text: to.common.getEisenhowerFilterDescription(params.priorities, params.urgencies)
                });
                indexes.push('EISENHOWER');
            }
            if (this.bookmark.hasKanbanPlannedFilter || this.bookmark.hasKanbanReadyFilter
                || this.bookmark.hasKanbanInProgressFilter || this.bookmark.hasKanbanRecentlyDoneFilter) {
                buttons.push({
                    text: "<i class=\"fa " + to.common.getKanbanClass(params.kanbanState) + "\"></i>: " + to.common.getKanbanState(params.kanbanState)
                });
                indexes.push('KANBAN');
            }
            if (this.bookmark.hasCategoryFilter) {
                buttons.push({
                    text: '<i class="fa fa-folder-open-o"></i>: ' + categoryLabel
                });
                indexes.push('CATEGORY');
            }
            if (this.bookmark.hasMotivationFilter) {
                buttons.push({
                    text: '<i class="fa fa-dot-circle-o"></i>: ' + motivationLabel
                });
                indexes.push('MOTIVATION');
            }
            var filterActionSheet = {
                buttons: buttons,
                titleText: 'Remove from ' + to.common.getBookmarkViewName(this.$state.current.name),
                cancelText: 'Cancel',
                buttonClicked: function (index) {
                    var params = JSON.parse(JSON.stringify(_this.$state.params));
                    switch (indexes[index]) {
                        case 'KANBAN':
                            params.kanbanState = to.common.Kanban.AllIncomplete;
                            break;
                        case 'EISENHOWER':
                            params.priorities = to.common.Priority.All;
                            params.urgencies = to.common.Urgency.All;
                            break;
                        case 'CATEGORY':
                            params.categoryId = 0;
                            break;
                        case 'MOTIVATION':
                            params.motivationId = 0;
                            break;
                        case 'ALL':
                            params.kanbanState = to.common.Kanban.AllIncomplete;
                            params.priorities = to.common.Priority.All;
                            params.urgencies = to.common.Urgency.All;
                            params.categoryId = 0;
                            params.motivationId = 0;
                            break;
                    }
                    _this.$state.go(_this.$state.current.name, params);
                    return true;
                },
                destructiveButtonClicked: function () {
                    _this.bookmarkRepository.save(_this.bookmark).then(function (bookmark) {
                        _this.bookmark = bookmark;
                        _this.bookmarkSaved = true;
                        _this.$scope.$apply();
                    });
                    return true;
                }
            };
            if (!this.bookmarkSaved) {
                filterActionSheet.destructiveText = 'Make a new Bookmark';
            }
            this.$ionicActionSheet.show(filterActionSheet);
        };
        MainController.prototype.goBack = function () {
            window.history.back();
            jQuery('.org-back-button').hide();
        };
        MainController.prototype.getInfo = function () {
            var params = this.$state.params;
            var urgencies = params.urgencies;
            var priorities = params.priorities;
            var kanbanState = params.kanbanState;
            var categoryId = params.categoryId;
            var motivationId = params.motivationId;
            switch (this.$state.current.name) {
                case to.common.states.CATEGORIES:
                case to.common.states.EDIT_ACTION:
                case to.common.states.EDIT_CATEGORIES_FOR_ACTION:
                case to.common.states.EDIT_CATEGORY:
                case to.common.states.EDIT_MOTIVATION:
                case to.common.states.EDIT_MOTIVATIONS_FOR_ACTION:
                case to.common.states.EISENHOWER:
                case to.common.states.ENTER_ACTION:
                case to.common.states.ENTER_CATEGORY:
                case to.common.states.ENTER_MOTIVATION:
                case to.common.states.LIST_ACTIONS:
                case to.common.states.MOTIVATIONS:
                case to.common.states.BOOKMARKS:
                case to.common.states.KANBAN:
                    break;
                default:
            }
            console.log('in get info');
        };
        MainController.prototype.getFunctionFromString = function (string) {
            var scope = window;
            var scopeSplit = string.split('.');
            for (var i = 0; i < scopeSplit.length - 1; i++) {
                scope = scope[scopeSplit[i]];
                if (scope == undefined)
                    return;
            }
            return scope[scopeSplit[scopeSplit.length - 1]];
        };
        return MainController;
    })();
    angular
        .module('organizator').controller('MainController', MainController);
})(to || (to = {}));
//# sourceMappingURL=MainController.js.map