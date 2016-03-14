///<reference path="../imports.ts"/>
/**
 * Created by artem on 4/9/15.
 */

module to.enter {

	class EditMotivationController extends to.common.MotivationController {

		action:to.model.Action;

		inEditMode = true;

		constructor
		($ionicHistory,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private $stateParams:to.common.ObjectStateParameters,
		 private motivationRepository:to.storage.MotivationRepository) {
			super($ionicHistory, $scope, $state, 'EditMotivationController', 'Reason');
			motivationRepository.get($stateParams.id).then((motivation)=> {
				this.motivation = motivation;
				var unbindHandler = $scope.$on('$ionicView.beforeLeave', ()=> {
					this.motivationRepository.update(this.motivation);
					unbindHandler();
				});
				this.afterDataLoad();
			});
		}

		saveMotivation() {
			this.motivationRepository.update(this.motivation).then(()=> {
				this.back();
			});
		}

		saveMotivationLabel() {
			return 'Save';
		}
	}

	angular.module('organizator').controller('EditMotivationController', EditMotivationController);
}