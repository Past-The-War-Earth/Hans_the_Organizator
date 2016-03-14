///<reference path="../imports.ts"/>

/**
 * Created by artem on 6/27/15.
 */

module to.storage {

	export class BookmarkRepository extends CachedRepository<to.model.DbBookmark> {

		constructor
		($ionicPopup,
		 pouchDB) {
			super($ionicPopup, 'bookmark_', pouchDB);
		}

		bookmarkExists(criteria:to.model.DbBookmark):Promise<boolean> {
			return this.getAll().then((objects)=>{
				return objects.some((bookmark)=> {
					return bookmark.categoryId == criteria.categoryId
						&& bookmark.kanbanState == criteria.kanbanState
						&& bookmark.motivationId == criteria.motivationId
						&& bookmark.priorities == criteria.priorities
						&& bookmark.stateName == criteria.stateName
						&& bookmark.urgencies == criteria.urgencies;
				});
			});
		}

		reorder(bookmarks:to.model.Bookmark[]):Promise<any> {
			var i = 0;
			bookmarks.forEach((bookmark)=> {
				bookmark.dbBookmark.orderIndex = i++;
			});
			return this.db.bulkDocs(this.objects)
				.then((results:DbUpdateRecord[])=> {
					results.forEach((updateRecord)=> {
						this.mapById[updateRecord.id]._rev = updateRecord.rev;
					})
				})
				.catch((error:DbError[])=> {
					this.$ionicPopup.alert({
						title: 'Database Error',
						template: 'Error updating bookmarks'
					});
				});
		}

		delete(dbBookmark:to.model.DbBookmark):Promise<any> {
			return this.db.remove(dbBookmark).then((result:DbUpdateRecord)=> {
				delete this.mapById[dbBookmark._id];
				this.objects.some((aDbBookmark, index)=>{
					if(aDbBookmark._id == dbBookmark._id) {
						this.objects.splice(index, 1);
						return true;
					}
					return false;
				});
				return result;
			}).catch((error:DbError)=> {
				this.$ionicPopup.alert({
					title: 'Database Error',
					template: 'Error deleting a bookmark.'
				});
			})
		}

	}
	angular.module('organizator').service('bookmarkRepository', BookmarkRepository);
}