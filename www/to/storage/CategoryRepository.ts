///<reference path="../imports.ts"/>
/**
 * Created by artem on 3/27/15.
 */

module to.storage {

	export class CategoryRepository extends CachedRepository<to.model.Category> {
		categories:to.model.Category[] = [];
		mapById:{[id:string]:to.model.Category};
		db;

		constructor
		($ionicPopup,
		 private actionRepository:ActionRepository,
		 pouchDB) {
			super($ionicPopup, 'category_', pouchDB)
		}

		getByParameters
		(urgencies,
		 priorities,
		 kanbanState,
		 motivationId):Promise<to.model.Category[]> {

			if (urgencies == to.common.Urgency.All && priorities == to.common.Priority.All && kanbanState == to.common.Kanban.AllIncomplete && motivationId == "0") {
				return this.getAll();
			}

			var categoryIdMap = {};
			return this.actionRepository.getByParameters(urgencies, priorities, kanbanState, 0, motivationId).then((actions)=> {
				actions.forEach((action:to.model.Action)=> {
					action.categoryIds.forEach((categoryId:string)=> {
						categoryIdMap[categoryId] = true;
					});
				});

				var categoryIds = [];
				for (var categoryId in categoryIdMap) {
					categoryIds.push(categoryId);
				}

				return this.getAllByIds(categoryIds);
			});
		}

	}

	angular.module('organizator').service('categoryRepository', CategoryRepository);
}