///<reference path="../imports.ts"/>
/**
 * Created by artem on 6/2/15.
 */

module to.enter {

	class ViewCategoryController extends to.common.CategoryController {

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
			super($ionicHistory, $scope, $state, 'ViewCategoryController', 'Category');
			this.reload();
		}

		reload() {
			this.categoryRepository.get(this.$stateParams.categoryId)
				.then((category)=> {
					this.category = category;
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

		viewMotivations() {
			this.$state.go(to.common.states.MOTIVATIONS, this.$stateParams);
		}

		edit() {
			this.$state.go(to.common.states.EDIT_CATEGORY, {id: this.category._id});
		}
	}

	angular.module('organizator').controller('ViewCategoryController', ViewCategoryController);

}
