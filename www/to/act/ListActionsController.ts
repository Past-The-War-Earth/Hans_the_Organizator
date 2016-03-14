///<reference path="../imports.ts"/>

/**
 * Created by artem on 4/7/15.
 */

module to.act {

	function getViewLabel
	(kanbanState) {
		if (kanbanState == to.common.Kanban.Archived) {
			return 'Archive';
		} else if (kanbanState == to.common.Kanban.Planned) {
			return 'Plans';
		}
		return 'Actions';
	}

	class ListActionsController extends common.ActionsController {

		private actions:to.model.Action[];
		sorter:to.common.sort.ActionSorter;

		constructor
		($ionicHistory,
		 private $ionicPopup,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private $stateParams,
		 private actionRepository:to.storage.ActionRepository,
		 categoryRepository:to.storage.CategoryRepository,
		 motivationRepository:to.storage.MotivationRepository) {
			super($ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'ListActionsController', getViewLabel($stateParams.kanbanState));
			this.reload();
		}


		// DONE: Keep parent view names short, INSTEAD OF: rip out back navigation and always replace with menu icon?
		// or disable non-applicable navigation buttons (if it's worth it?)
		// DONE: Fix repositories not being initialized fast enough if starting with the "edit" action controller
		// DONE: Fix repositories not being initialized fast enough if starting with the "edit" and "view" category controller
		// DONE: Fix repositories not being initialized fast enough if starting with the "edit" and "view" motivation controller
		// TODO: add auto-move from recently done to archive
		// DONE: add sorting to Categories and Motivations
		//		 DONE: create Category and Motivation sorters
		//		 DONE: test kanban state changes
		//		 DONE: test sorting
		//		 TODO: create ability to cancel MAKE SURE TO COUNT CANCELLED AS NOT DONE
		//		 TODO: add ability to Ready action from details

		// Redundant: add add-action to motivations and categories
		// DONE: change actions on action's categories and motivations to just add or remove from action
		// and edit as the auxillary

		// Removed flow: add back-to-back back navigation on "add/edit category/motivation from enter action"
		// DONE: add read view for Actions with links to edit screens
		// DONE: add read view for Categories with links to edit screens
		// DONE: add read view for Motivations with links to edit screens

		// TODO: Postponed - add pictures to Actions, Categories and Motivations
		// TODO: disable-non applicable sub-navigation buttons (Ex: in Eisenhower when displaying recenty done actions)
		// TODO: add sorting to archive
		// TODO: add sorting to Kanban?
		// TODO: add additional attributes to Kanban?
		// Canceled: add color coding to categories - Color is on app level, per section
		// DONE: Split Edit/Add action view into sentence based and itemized - aka: rework Action edit screen
		// ?TODO?: Add a wizard to action creation
		// TODO: Add "expires" flag to Actions - expire if past due
		// DONE: add cronological view to action that uses change log

		// Test with SqLite cordova plugin


		trackActions() {
			this.$state.go(to.common.states.EISENHOWER, this.$stateParams);
		}

		reload() {
			return super.reload().then(()=> {
				return this.actionRepository.getByParameters
				(this.$stateParams.urgencies,
					this.$stateParams.priorities,
					this.$stateParams.kanbanState,
					this.$stateParams.categoryId,
					this.$stateParams.motivationId).then((actions)=> {
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

	}

	angular.module('organizator').controller('ListActionsController', ListActionsController);
}
