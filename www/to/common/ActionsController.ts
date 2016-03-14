///<reference path="../imports.ts"/>

/**
 * Created by artem on 5/3/15.
 */
module to.common {

	class PriorityAccessor {
		constructor(private categoryMap:to.storage.ObjectMap<to.model.Category>) {
		}

		getClass(categoryId) {
			var category = this.categoryMap[categoryId];
			return category ? to.common.getPriorityClass(category.priority, false) : '';
		}
	}

	class ImpactAccessor {
		constructor(private motivationMap:to.storage.ObjectMap<to.model.Motivation>) {
		}

		getClass(motivationId) {
			var motivation = this.motivationMap[motivationId];
			return motivation ? to.common.getImpactClass(motivation) : '';
		}
	}

	export class ActionsController extends BranchComponent {

		priority:PriorityAccessor;

		impact:ImpactAccessor;

		constructor
		($ionicHistory,
		 $scope:angular.IScope,
		 $state,
		 protected categoryRepository:to.storage.CategoryRepository,
		 protected motivationRepository:to.storage.MotivationRepository,
		 name:string,
		 viewTitle:string) {
			super($ionicHistory, $scope, $state, name, viewTitle);
		}

		reload():Promise<any> {
			var operations:Promise<any>[] = [this.categoryRepository.getMap(),
				this.motivationRepository.getMap()];
			return Promise.all(operations).then((results)=>{
				this.priority = new PriorityAccessor(results[0]);
				this.impact = new ImpactAccessor(results[1]);
			});

		}

		selectAction
		(action:to.model.Action) {
			var params:to.common.ActionDetailParameters = {
				actionId: action._id
			};
			this.$state.go(to.common.states.VIEW_ACTION, params);
		}

	}
}
