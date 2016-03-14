///<reference path="../imports.ts"/>
/**
 * Created by artem on 4/9/15.
 */

module to.enter {

	class EditCategoryController extends to.common.CategoryController {

		action:to.model.Action;

		constructor
		($ionicHistory,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private $stateParams:to.common.ObjectStateParameters,
		 private categoryRepository:to.storage.CategoryRepository) {
			super($ionicHistory, $scope, $state, 'EditCategoryController', 'Category');
			categoryRepository.get($stateParams.id).then((category)=> {
				this.category = category;
				var unbindHandler = $scope.$on('$ionicView.beforeLeave', ()=> {
					this.categoryRepository.update(this.category);
					unbindHandler();
				});
				this.afterDataLoad();
			});
		}

		saveCategory() {
			this.categoryRepository.update(this.category).then(()=> {
				this.back();
			});
		}

		saveCategoryLabel() {
			return 'Save';
		}

	}

	angular.module('organizator').controller('EditCategoryController', EditCategoryController);
}