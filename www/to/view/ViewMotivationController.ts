///<reference path="../imports.ts"/>
/**
 * Created by artem on 6/2/15.
 */

module to.enter {

	class ViewMotivationController extends to.common.MotivationController {

		loaded:boolean;

		constructor
		($ionicHistory,
		 private $ionicPopup,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private $stateParams,
		 private actionRepository:to.storage.ActionRepository,
		 private actionService:to.act.ActionService,
		 private archiveRepository:to.storage.ArchiveRepository,
		 private categoryRepository:to.storage.CategoryRepository,
		 private motivationRepository:to.storage.MotivationRepository) {
			super($ionicHistory, $scope, $state, 'ViewMotivationController', 'Reason');
			this.reload();
		}

		reload() {
			this.motivationRepository.get(this.$stateParams.motivationId).then((motivation)=>{
				this.motivation = motivation;
				this.loaded = true;
				this.afterDataLoad();
			});
		}

		viewPlans() {
			this.$stateParams.kanbanState = to.common.Kanban.Planned;
			this.$state.go(to.common.states.LIST_ACTIONS, this.$stateParams);
		}

		viewKanban() {
			this.$state.go(to.common.states.KANBAN, this.$stateParams);
		}

		viewEisenhower() {
			this.$state.go(to.common.states.EISENHOWER, this.$stateParams);
		}

		viewCategories() {
			this.$state.go(to.common.states.CATEGORIES, this.$stateParams);
		}

		edit() {
			this.$state.go(to.common.states.EDIT_MOTIVATION, {id: this.motivation._id});
		}
	}

	angular.module('organizator').controller('ViewMotivationController', ViewMotivationController);

}
