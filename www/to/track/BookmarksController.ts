///<reference path="../imports.ts"/>

/**
 * Created by artem on 3/22/15.
 */

module to.track {

	class BookmarksController extends to.common.BranchComponent {

		showReorder:boolean;
		showDelete:boolean;
		bookmarks:to.model.Bookmark[] = [];

		constructor
		($ionicHistory,
		 private $ionicLoading,
		 $scope:angular.IScope,
		 $state,
		 private bookmarkRepository:to.storage.BookmarkRepository,
		 private categoryRepository:to.storage.CategoryRepository,
		 private motivationRepository:to.storage.MotivationRepository) {
			super($ionicHistory, $scope, $state, 'BookmarksController', 'Bookmarks');
			this.reload();
		}

		reload() {
			this.bookmarkRepository.getAll().then((dbBookmarks)=> {
				dbBookmarks.forEach((dbBookmark)=> {
					var bookmark:to.model.Bookmark = {
						dbBookmark: dbBookmark
					};
					if(dbBookmark.hasCategoryFilter) {
						this.categoryRepository.get(dbBookmark.categoryId).then((category)=>{
							bookmark.category = category;
						});
					}
					if(dbBookmark.hasMotivationFilter) {
						this.motivationRepository.get(dbBookmark.motivationId).then((motivation)=>{
							bookmark.motivation = motivation;
						});
					}
					this.bookmarks.push(bookmark);
				});
				this.afterDataLoad();
			})
		}

		getBookmarkViewName(bookmark) {
			return to.common.getBookmarkViewName(bookmark.dbBookmark.stateName);
		}

		getTrackingDetails(bookmark) {
			return to.common.getEisenhowerFilterDescription(bookmark.dbBookmark.priorities, bookmark.dbBookmark.urgencies, true);
		}

		goToBookmark(bookmark) {
			var params = {
				categoryId: bookmark.dbBookmark.categoryId,
				kanbanState: bookmark.dbBookmark.kanbanState,
				motivationId: bookmark.dbBookmark.motivationId,
				priorities: bookmark.dbBookmark.priorities,
				urgencies: bookmark.dbBookmark.urgencies
			};
			this.$state.go(bookmark.dbBookmark.stateName, params);
		}

		getToggleReorderIcon() {
			return this.showReorder ? 'fa-save' : 'fa-reorder';
		}

		toggleReorder() {
			if (this.showReorder) {
				this.reorderBookmarks().then(()=> {
					this.showReorder = !this.showReorder;
				});
			} else {
				this.showReorder = !this.showReorder;
			}
		}

		toggleDelete() {
			this.showDelete = !this.showDelete;
		}

		moveABookmark(bookmark, fromIndex, toIndex) {
			this.bookmarks.splice(fromIndex, 1);
			this.bookmarks.splice(toIndex, 0, bookmark);
		}

		deleteABookmark(bookmark) {
			var foundBookmark = this.bookmarks.some((aBookmark, index)=> {
				if (aBookmark.dbBookmark._id == bookmark.dbBookmark._id) {
					this.bookmarks.splice(index, 1);
					return true;
				}
				return false;
			});
			if (foundBookmark) {
				this.$ionicLoading.show({
					template: 'Deleting...'
				});
				this.bookmarkRepository.delete(bookmark.dbBookmark).then(()=> {
					this.$ionicLoading.hide();
				});
			}
		}

		reorderBookmarks():Promise<any> {
			this.$ionicLoading.show({
				template: 'Saving...'
			});
			return this.bookmarkRepository.reorder(this.bookmarks).then(()=> {
				this.$ionicLoading.hide();
			});
		}

	}

	angular.module('organizator').controller('BookmarksController', BookmarksController);

}