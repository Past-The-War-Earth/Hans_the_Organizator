///<reference path="../imports.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by artem on 6/27/15.
 */
var to;
(function (to) {
    var storage;
    (function (storage) {
        var BookmarkRepository = (function (_super) {
            __extends(BookmarkRepository, _super);
            function BookmarkRepository($ionicPopup, pouchDB) {
                _super.call(this, $ionicPopup, 'bookmark_', pouchDB);
            }
            BookmarkRepository.prototype.bookmarkExists = function (criteria) {
                return this.getAll().then(function (objects) {
                    return objects.some(function (bookmark) {
                        return bookmark.categoryId == criteria.categoryId
                            && bookmark.kanbanState == criteria.kanbanState
                            && bookmark.motivationId == criteria.motivationId
                            && bookmark.priorities == criteria.priorities
                            && bookmark.stateName == criteria.stateName
                            && bookmark.urgencies == criteria.urgencies;
                    });
                });
            };
            BookmarkRepository.prototype.reorder = function (bookmarks) {
                var _this = this;
                var i = 0;
                bookmarks.forEach(function (bookmark) {
                    bookmark.dbBookmark.orderIndex = i++;
                });
                return this.db.bulkDocs(this.objects)
                    .then(function (results) {
                    results.forEach(function (updateRecord) {
                        _this.mapById[updateRecord.id]._rev = updateRecord.rev;
                    });
                })
                    .catch(function (error) {
                    _this.$ionicPopup.alert({
                        title: 'Database Error',
                        template: 'Error updating bookmarks'
                    });
                });
            };
            BookmarkRepository.prototype.delete = function (dbBookmark) {
                var _this = this;
                return this.db.remove(dbBookmark).then(function (result) {
                    delete _this.mapById[dbBookmark._id];
                    _this.objects.some(function (aDbBookmark, index) {
                        if (aDbBookmark._id == dbBookmark._id) {
                            _this.objects.splice(index, 1);
                            return true;
                        }
                        return false;
                    });
                    return result;
                }).catch(function (error) {
                    _this.$ionicPopup.alert({
                        title: 'Database Error',
                        template: 'Error deleting a bookmark.'
                    });
                });
            };
            return BookmarkRepository;
        }(storage.CachedRepository));
        storage.BookmarkRepository = BookmarkRepository;
        angular.module('organizator').service('bookmarkRepository', BookmarkRepository);
    })(storage = to.storage || (to.storage = {}));
})(to || (to = {}));
//# sourceMappingURL=BookmarkRepository.js.map