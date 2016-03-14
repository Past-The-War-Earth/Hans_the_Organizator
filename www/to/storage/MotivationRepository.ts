///<reference path="../imports.ts"/>
/**
 * Created by artem on 4/4/15.
 */

module to.storage {

	export class MotivationRepository extends CachedRepository<to.model.Motivation> {

		constructor
		($ionicPopup,
		 private actionRepository:ActionRepository,
		 pouchDB) {
			super($ionicPopup, 'motivation_', pouchDB);
		}

		getByParameters
		(urgencies,
		 priorities,
		 kanbanState,
		 categoryId):Promise<to.model.Motivation[]> {
			if (urgencies == to.common.Urgency.All && priorities == to.common.Priority.All && kanbanState == to.common.Kanban.AllIncomplete && categoryId == "0") {
				return this.getAll();
			}
			return this.actionRepository.getByParameters(urgencies, priorities, kanbanState, categoryId, 0).then((actions)=> {
				var motivationIdMap = {};

				actions.forEach((action:to.model.Action)=> {
					action.motivationIds.forEach((motivationId:string)=> {
						motivationIdMap[motivationId] = true;
					})
				});

				var motivationIds = [];
				for (var motivationId in motivationIdMap) {
					motivationIds.push(motivationId);
				}

				return this.getAllByIds(motivationIds);
			});
		}

	}
	angular.module('organizator').service('motivationRepository', MotivationRepository);
}