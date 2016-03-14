///<reference path="../imports.ts"/>
/**
 * Created by artem on 3/24/15.
 */

module to.enter {

	class AddMotivationsToActionController extends to.common.BranchComponent {

		motivations:to.model.Motivation[];
		otherMotivations:to.model.Motivation[];

		action:to.model.Action;

		constructor
		(private $ionicActionSheet,
		 $ionicHistory,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private $stateParams:to.common.ActionDetailParameters,
		 private actionRepository:to.storage.ActionRepository,
		 private actionService:to.act.ActionService,
		 private motivationRepository:to.storage.MotivationRepository) {
			super($ionicHistory, $scope, $state, 'AddMotivationsToActionController', 'Add Reason');
			this.reload();
		}

		reload() {
			this.actionRepository.get(this.$stateParams.actionId).then((action)=> {
				this.action = action;
				var operations:Promise<any>[] = [this.motivationRepository.getAllByIds(this.action.motivationIds),
					this.motivationRepository.getAll()];
				Promise.all(operations).then((results)=> {
					this.motivations = results[0];
					var inActionMotivationMap:{[id:string]:boolean} = {};
					this.motivations.forEach((motivation:to.model.Motivation)=> {
						inActionMotivationMap[motivation._id] = true;
					});
					this.otherMotivations = results[1].filter((motivation:to.model.Motivation)=> {
						return !inActionMotivationMap[motivation._id];
					});
					this.afterDataLoad();
				});
			});
		}

		addMotivation():void {
			var params:to.common.ActionDetailParameters = {
				actionId: this.$stateParams.actionId
			};
			this.$state.go(to.common.states.ENTER_MOTIVATION, params);
		}

		addMotivationToAction(motivation:to.model.Motivation):void {
			this.actionService.addMotivation(this.action, motivation);
			this.back();
		}

		editMotivation
		(motivation:to.model.Motivation):void {
			var params:to.common.ActionDetailParameters = {
				actionId: this.$stateParams.actionId,
				id: motivation._id
			};
			this.$state.go(to.common.states.EDIT_MOTIVATION, params);
		}

		selectMotivationActionSheet
		(motivation:to.model.Motivation):void {
			this.$ionicActionSheet.show({
				buttons: [
					{text: 'Edit'},
					{text: 'Add to Action'}
				],
				titleText: motivation.description,
				cancelText: 'Cancel',
				buttonClicked: (index) => {
					switch (index) {
						case 0:
							this.editMotivation(motivation);
							break;
						case 1:
							this.actionService.addMotivation(this.action, motivation);
							this.motivations.push(motivation);
							for (var i = 0; i < this.otherMotivations.length; i++) {
								if (this.otherMotivations[i]._id == motivation._id) {
									this.otherMotivations.splice(i, 1);
								}
							}

							this.back();
							break;
					}
					return true;
				}
			});
		}

		deselectMotivationActionSheet
		(motivation:to.model.Motivation) {

			// Show the action sheet
			this.$ionicActionSheet.show({
				buttons: [
					{text: 'Edit'}
				],
				destructiveText: 'Remove from Action',
				titleText: motivation.description,
				cancelText: 'Cancel',
				buttonClicked: (index)=> {
					this.editMotivation(motivation);
					return true;
				},
				destructiveButtonClicked: ()=> {
					for (var i = 0; i < this.motivations.length; i++) {
						if (this.motivations[i]._id == motivation._id) {
							this.motivations.splice(i, 1);
						}
					}
					this.actionService.removeMotivation(this.action, motivation);
					this.otherMotivations.push(motivation);

					this.back();
					return true;
				}
			});

		}

	}

	angular.module('organizator').controller('AddMotivationsToActionController', AddMotivationsToActionController);
}
