///<reference path="../imports.ts"/>

/**
 * Created by artem on 4/7/15.
 */

module to.act {

	var sortBy:string;
	var ascending:boolean;

	interface SortState {
		sortBy:string;
		ascending:boolean;
	}

	var currentSortState:SortState = {
		sortBy: 'URGENCY',
		ascending: false
	};

	class PlansController extends common.ActionsController {

		private actions:to.model.Action[];
		sorter:to.common.sort.ActionSorter;

		constructor
		($ionicHistory,
		 private $ionicPopup,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private actionRepository:to.storage.ActionRepository,
		 private actionService:to.act.ActionService,
		 categoryRepository:to.storage.CategoryRepository,
		 motivationRepository:to.storage.MotivationRepository) {
			super($ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'PlansController', 'Plan');
			this.reload();
		}

		reload() {
			return super.reload().then(()=> {
				return this.actionRepository.getAllPlanned().then((actions)=> {
					this.actions = actions;
					this.sorter = new to.common.sort.ActionSorter(this.$ionicPopup, this.$scope, this.actions, {
						sortBy: 'URGENCY',
						ascending: false
					});
					this.sorter.sort();
					this.afterDataLoad();
				});
			});
		}

		trackActions() {
			this.$state.go(to.common.states.EISENHOWER, {kanbanState: to.common.Kanban.Planned});
		}

		addAction() {
			this.$state.go(to.common.states.ENTER_ACTION);

		}

	}

	angular.module('organizator').controller('PlansController', PlansController);
}
