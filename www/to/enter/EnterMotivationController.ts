///<reference path="../imports.ts"/>
/**
 * Created by artem on 4/4/15.
 */
module to.enter {
	class EnterMotivationController extends to.common.MotivationController {

		action:to.model.Action;

		constructor
		($ionicHistory,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private $stateParams:to.common.ActionDetailParameters,
		 private actionRepository:to.storage.ActionRepository,
		 private actionService:to.act.ActionService,
		 private motivationRepository:to.storage.MotivationRepository) {
			super($ionicHistory, $scope, $state, 'EnterMotivationController', 'New Reason');
			if ($stateParams.actionId) {
				actionRepository.get($stateParams.actionId).then((action)=> {
					this.action = action;
				});
			}
			this.motivation = {
				comments: [],
				description: '',
				helpLevel: 3,
				impact: 3,
				avgActionPriority: 0,
				avgTimeInPlanning: 0,
				avgTimeInReady: 0,
				avgTimeInProgress: 0,
				avgCompletionTime: 0,
				numActions: 0,
				numCanceledActions: 0,
				numCompleteActions: 0,
				numInProgressActions: 0,
				numPlannedActions: 0,
				numReadyActions: 0,
				numRevertedActions: 0,
				positive: true,
				type: 'motivation'
			};

		}

		getConditionLabel() {
			var condition = 'do it';
			if (this.action && this.action.phrase) {
				condition = this.action.phrase;
			}
			return super.getConditionLabel(condition);
		}

		saveMotivation() {
			if (this.comment) {
				this.motivation.comments.push(this.comment);
			}
			this.motivationRepository.save(this.motivation).then(()=> {
				if (this.action) {
					this.actionService.addMotivation(this.action, this.motivation);
				}
				this.back();
			});

		}

		saveMotivationLabel() {
			return 'Enter';
		}

	}

	angular.module('organizator').controller('EnterMotivationController', EnterMotivationController);
}
