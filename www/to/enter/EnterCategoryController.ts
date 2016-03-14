///<reference path="../imports.ts"/>
/**
 * Created by artem on 3/29/15.
 */

module to.enter {

	class EnterCategoryController extends to.common.CategoryController {

		action:to.model.Action;

		constructor
		($ionicHistory,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private $stateParams:to.common.ActionDetailParameters,
		 private actionRepository:to.storage.ActionRepository,
		 private actionService:to.act.ActionService,
		 private categoryRepository:to.storage.CategoryRepository) {
			super($ionicHistory, $scope, $state, 'EnterCategoryController', 'New Category');
			if ($stateParams.actionId) {
				actionRepository.get($stateParams.actionId).then((action)=> {
					this.action = action;
					this.afterDataLoad();
				});
			}
			this.category = {
				avgActionPriority: 0,
				avgCompletionTime: 0,
				avgTimeInPlanning: 0,
				avgTimeInProgress: 0,
				avgTimeInReady: 0,
				helpLevel: 3,
				name: '',
				numActions: 0,
				numCanceledActions: 0,
				numCompleteActions: 0,
				numInProgressActions: 0,
				numPlannedActions: 0,
				numReadyActions: 0,
				numRevertedActions: 0,
				priority: "3",
				type: 'category'
			};
		}

		saveCategory() {
			this.categoryRepository.save(this.category).then(()=> {
				if (this.action) {
					this.actionService.addCategory(this.action, this.category);
				}
				this.back();
			});
		}

		saveCategoryLabel() {
			return 'Enter';
		}
	}

	angular.module('organizator').controller('EnterCategoryController', EnterCategoryController);
}
