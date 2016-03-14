///<reference path="../imports.ts"/>

/**
 * Created by artem on 4/17/15.
 */

module to.enter {

	class CategoriesController extends to.common.BranchComponent {

		private categories:to.model.Category[];
		sorter:to.common.sort.CategorySorter;

		constructor
		($ionicHistory,
		 private $ionicPopup,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private $stateParams,
		 private categoryRepository:to.storage.CategoryRepository) {
			super($ionicHistory, $scope, $state, 'CategoriesController', 'Categories');
			this.reload();
		}

		reload() {
			this.categoryRepository.getByParameters(this.$stateParams.urgencies, this.$stateParams.priorities, this.$stateParams.kanbanState, this.$stateParams.motivationId).then((categories)=> {
				this.categories = categories;
				this.sorter = new to.common.sort.CategorySorter(this.$ionicPopup, this.$scope, this.categories, {
					sortBy: 'NAME',
					ascending: true
				});
				this.afterDataLoad();
			});
		}

		addCategory() {
			this.$state.go(to.common.states.ENTER_CATEGORY);

		}

		selectCategory
		(category:to.model.Category) {
			this.$stateParams.categoryId = category._id;
			this.$state.go(to.common.states.VIEW_CATEGORY, this.$stateParams);
		}

		listActions
		(category:to.model.Category) {
			this.$state.go(to.common.states.LIST_ACTIONS, this.$stateParams);
		}
	}

	angular.module('organizator').controller('CategoriesController', CategoriesController);
}
