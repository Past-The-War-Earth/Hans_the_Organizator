///<reference path="../imports.ts"/>

/**
 * Created by artem on 4/17/15.
 */

module to.enter {

	class MotivationsController extends to.common.BranchComponent {

		private motivations:to.model.Motivation[];
		sorter:to.common.sort.MotivationSorter;

		constructor
		($ionicHistory,
		 private $ionicPopup,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private $stateParams,
		 private motivationRepository:to.storage.MotivationRepository) {
			super($ionicHistory, $scope, $state, 'MotivationsController', 'Reasons');
			this.reload();
		}

		reload() {
			this.motivationRepository.getByParameters(this.$stateParams.urgencies, this.$stateParams.priorities,
				this.$stateParams.kanbanState, this.$stateParams.categoryId).then((motivations)=> {
					this.motivations = motivations;
					this.sorter = new to.common.sort.MotivationSorter(this.$ionicPopup, this.$scope, this.motivations, {
						sortBy: 'NAME',
						ascending: true
					});
					this.afterDataLoad();
				});
		}

		addMotivation() {
			this.$state.go(to.common.states.ENTER_MOTIVATION);

		}

		selectMotivation
		(motivation:to.model.Motivation) {
			this.$stateParams.motivationId = motivation._id;
			this.$state.go(to.common.states.VIEW_MOTIVATION, this.$stateParams);
		}

		listActions
		(motivation:to.model.Motivation) {
			this.$state.go(to.common.states.LIST_ACTIONS, this.$stateParams);
		}
	}

	angular.module('organizator').controller('MotivationsController', MotivationsController);
}
