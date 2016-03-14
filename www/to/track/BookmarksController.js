var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var track;
    (function (track) {
        var BookmarksController = (function (_super) {
            __extends(BookmarksController, _super);
            function BookmarksController($ionicHistory, $ionicLoading, $scope, $state, bookmarkRepository, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, 'BookmarksController', 'Bookmarks');
                this.$ionicLoading = $ionicLoading;
                this.bookmarkRepository = bookmarkRepository;
                this.categoryRepository = categoryRepository;
                this.motivationRepository = motivationRepository;
                this.bookmarks = [];
                this.reload();
            }
            BookmarksController.prototype.reload = function () {
                var _this = this;
                this.bookmarkRepository.getAll().then(function (dbBookmarks) {
                    dbBookmarks.forEach(function (dbBookmark) {
                        var bookmark = {
                            dbBookmark: dbBookmark
                        };
                        if (dbBookmark.hasCategoryFilter) {
                            _this.categoryRepository.get(dbBookmark.categoryId).then(function (category) {
                                bookmark.category = category;
                            });
                        }
                        if (dbBookmark.hasMotivationFilter) {
                            _this.motivationRepository.get(dbBookmark.motivationId).then(function (motivation) {
                                bookmark.motivation = motivation;
                            });
                        }
                        _this.bookmarks.push(bookmark);
                    });
                    _this.afterDataLoad();
                });
            };
            BookmarksController.prototype.getBookmarkViewName = function (bookmark) {
                return to.common.getBookmarkViewName(bookmark.dbBookmark.stateName);
            };
            BookmarksController.prototype.getTrackingDetails = function (bookmark) {
                return to.common.getEisenhowerFilterDescription(bookmark.dbBookmark.priorities, bookmark.dbBookmark.urgencies, true);
            };
            BookmarksController.prototype.goToBookmark = function (bookmark) {
                var params = {
                    categoryId: bookmark.dbBookmark.categoryId,
                    kanbanState: bookmark.dbBookmark.kanbanState,
                    motivationId: bookmark.dbBookmark.motivationId,
                    priorities: bookmark.dbBookmark.priorities,
                    urgencies: bookmark.dbBookmark.urgencies
                };
                this.$state.go(bookmark.dbBookmark.stateName, params);
            };
            BookmarksController.prototype.getToggleReorderIcon = function () {
                return this.showReorder ? 'fa-save' : 'fa-reorder';
            };
            BookmarksController.prototype.toggleReorder = function () {
                var _this = this;
                if (this.showReorder) {
                    this.reorderBookmarks().then(function () {
                        _this.showReorder = !_this.showReorder;
                    });
                }
                else {
                    this.showReorder = !this.showReorder;
                }
            };
            BookmarksController.prototype.toggleDelete = function () {
                this.showDelete = !this.showDelete;
            };
            BookmarksController.prototype.moveABookmark = function (bookmark, fromIndex, toIndex) {
                this.bookmarks.splice(fromIndex, 1);
                this.bookmarks.splice(toIndex, 0, bookmark);
            };
            BookmarksController.prototype.deleteABookmark = function (bookmark) {
                var _this = this;
                var foundBookmark = this.bookmarks.some(function (aBookmark, index) {
                    if (aBookmark.dbBookmark._id == bookmark.dbBookmark._id) {
                        _this.bookmarks.splice(index, 1);
                        return true;
                    }
                    return false;
                });
                if (foundBookmark) {
                    this.$ionicLoading.show({
                        template: 'Deleting...'
                    });
                    this.bookmarkRepository.delete(bookmark.dbBookmark).then(function () {
                        _this.$ionicLoading.hide();
                    });
                }
            };
            BookmarksController.prototype.reorderBookmarks = function () {
                var _this = this;
                this.$ionicLoading.show({
                    template: 'Saving...'
                });
                return this.bookmarkRepository.reorder(this.bookmarks).then(function () {
                    _this.$ionicLoading.hide();
                });
            };
            return BookmarksController;
        })(to.common.BranchComponent);
        angular.module('organizator').controller('BookmarksController', BookmarksController);
    })(track = to.track || (to.track = {}));
})(to || (to = {}));
//# sourceMappingURL=BookmarksController.js.map