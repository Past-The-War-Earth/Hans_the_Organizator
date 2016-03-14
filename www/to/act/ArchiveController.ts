///<reference path="../imports.ts"/>

/**
 * Created by artem on 4/7/15.
 */

module to.act {

	class ArchiveController extends common.ActionsController {

		private actions:to.model.Action[];

		constructor
		($ionicHistory,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private $stateParams,
		 private archiveRepository:to.storage.ArchiveRepository,
		 protected categoryRepository:to.storage.CategoryRepository,
		 protected motivationRepository:to.storage.MotivationRepository) {
			super($ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'ArchiveController', 'Archive');
			this.reload();
		}

		/// FIXME: add support for paging and searching the archive via PouchDB

		reload() {
			return super.reload().then(()=> {
				return this.archiveRepository.getAll()
					.then((actions:to.model.Action[])=> {
						this.actions = actions;
						this.afterDataLoad();
					});
			});
		}

		selectAction
		(action:to.model.Action) {
			var params:to.common.ActionDetailParameters = {
				actionId: action._id,
				archive: 'Y'
			};
			this.$state.go(to.common.states.VIEW_ACTION, params);
		}

	}

	angular.module('organizator').controller('ArchiveController', ArchiveController);
}
