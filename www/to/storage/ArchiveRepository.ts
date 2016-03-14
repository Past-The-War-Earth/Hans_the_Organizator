///<reference path="../imports.ts"/>

/**
 * Created by artem on 4/29/15.
 */

module to.storage {

	export class ArchiveRepository {

		db;

		constructor
		(private $ionicPopup,
		 pouchDB) {
			this.db = pouchDB('archive');
		}

		get(actionId:string):Promise<to.model.Action> {
			return this.db.get(actionId).then((action)=>{
				return action;
			}).catch((errors:DbError)=>{
				this.$ionicPopup.alert({
					title: 'Database Error',
					template: 'Error retrieving from archive.'
				});
			});
		}

		//save(action:to.model.Action):void {
		//	action._id = 'archive_' + to.common.getCurrentDateTimestamp();
		//	delete action._rev;
		//	return this.db.put(action);
		//}

		getAll():Promise<to.model.Action[]> {
			return this.db.allDocs({startkey: 'archive_', endkey: 'archive_\uffff', include_docs: true})
				.then((result)=> {
					return result.rows.map((record)=> {
						return record.doc;
					});
				}).catch((errors:DbError[])=> {
					this.$ionicPopup.alert({
						title: 'Database Error',
						template: 'Error retrieving the archive.'
					});
				});
		}

	}

	angular.module('organizator').service('archiveRepository', ArchiveRepository);
}