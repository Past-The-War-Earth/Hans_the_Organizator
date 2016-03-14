///<reference path="../imports.ts"/>
/**
 * Created by artem on 3/22/15.
 */

module to.enter {

	class EnterActionController extends to.common.EditableActionController {

		constructor
		($ionicHistory,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private $stateParams,
		 private actionRepository:to.storage.ActionRepository,
     actionService:to.act.ActionService,
		 categoryRepository:to.storage.CategoryRepository,
		 motivationRepository:to.storage.MotivationRepository) {
			super($ionicHistory, $scope, $state, actionService, categoryRepository, motivationRepository, 'EnterActionController', $stateParams.brandNew === 'Y' ? 'New Action' : 'Copy Action');
			if ($stateParams.brandNew === 'Y') {
				actionRepository.setBrandNewAction();
			}
			this.reload();
		}

		getTitle(brandNew:boolean) {
			return brandNew ? 'Enter Action' : 'Copy Action';
		}

		reload():Promise<any> {
			this.action = this.actionRepository.getBrandNewAction();
			var operations:Promise<any>[] = [
				this.categoryRepository.getAllByIds(this.action.categoryIds),
				this.motivationRepository.getAllByIds(this.action.motivationIds)];
			return Promise.all(operations).then((results)=> {
				this.categories = <any>results[0];
				this.motivations = <any>results[1];
        this.beforeActions = [];
        this.afterActions = [];
				this.afterDataLoad();
			});
		}

		operateOnAction() {
			this.convertRanges();
			this.actionRepository.save(this.action).then(()=> {
				if (this.$stateParams.brandNew === 'Y') {
					this.back();
				} else {
					this.doneModifying();
					this.$state.go(to.common.states.PLANS);
				}
			});
		}

		operateOnActionLabel() {
			return 'Enter';
		}
	}

	angular.module('organizator').controller('EnterActionController', EnterActionController);
}
