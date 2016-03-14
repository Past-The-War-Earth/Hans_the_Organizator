///<reference path="../imports.ts"/>
/**
 * Created by artem on 3/24/15.
 */

module to.enter {

	class AddCategoriesToActionController extends to.common.BranchComponent {

		categories:to.model.Category[];
		otherCategories:to.model.Category[];

		action:to.model.Action;

		constructor
		(private $ionicActionSheet,
		 $ionicHistory,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private $stateParams:to.common.ActionDetailParameters,
		 private actionRepository:to.storage.ActionRepository,
		 private actionService:to.act.ActionService,
		 private categoryRepository:to.storage.CategoryRepository) {
			super($ionicHistory, $scope, $state, 'AddCategoriesToActionController', 'Add Category');
			this.reload();
		}

		reload() {
			this.actionRepository.get(this.$stateParams.actionId).then((action)=> {
				this.action = action;
				var operations:Promise<any>[] = [this.categoryRepository.getAllByIds(this.action.categoryIds),
					this.categoryRepository.getAll()];
				Promise.all(operations).then((results)=> {
					this.categories = results[0];
					var inActionCategoryMap:{[id:string]:boolean} = {};
					this.categories.forEach((category:to.model.Category)=> {
						inActionCategoryMap[category._id] = true;
					});
					this.otherCategories = results[1].filter((category:to.model.Category)=> {
						return !inActionCategoryMap[category._id];
					});
					this.afterDataLoad();
				});
			});
		}

		addCategory():void {
			var params:to.common.ActionDetailParameters = {
				actionId: this.$stateParams.actionId
			};
			this.$state.go(to.common.states.ENTER_CATEGORY, params);
		}

		addCategoryToAction(category:to.model.Category) {
			this.actionService.addCategory(this.action, category);
			this.back();
		}

		editCategory
		(category:to.model.Category):void {
			var params:to.common.ActionDetailParameters = {
				actionId: this.$stateParams.actionId,
				id: category._id
			};
			this.$state.go(to.common.states.EDIT_CATEGORY, params);
		}

		selectCategoryActionSheet
		(category:to.model.Category):void {
			this.$ionicActionSheet.show({
				buttons: [
					{text: 'Edit'},
					{text: 'Add to Action'}
				],
				titleText: category.name,
				cancelText: 'Cancel',
				buttonClicked: (index) => {
					switch (index) {
						case 0:
							this.editCategory(category);
							break;
						case 1:
							this.actionService.addCategory(this.action, category);
							this.categories.push(category);
							for (var i = 0; i < this.otherCategories.length; i++) {
								if (this.otherCategories[i]._id == category._id) {
									this.otherCategories.splice(i, 1);
								}
							}

							this.back();
							break;
					}
					return true;
				}
			});
		}

		deselectCategoryActionSheet
		(category:to.model.Category) {

			// Show the action sheet
			this.$ionicActionSheet.show({
				buttons: [
					{text: 'Edit'}
				],
				destructiveText: 'Remove from Action',
				titleText: category.name,
				cancelText: 'Cancel',
				buttonClicked: (index)=> {
					this.editCategory(category);
					return true;
				},
				destructiveButtonClicked: ()=> {
					for (var i = 0; i < this.categories.length; i++) {
						if (this.categories[i]._id == category._id) {
							this.categories.splice(i, 1);
						}
					}
					this.actionService.removeCategory(this.action, category);
					this.otherCategories.push(category);

					this.back();
					return true;
				}
			});


		}

		filterCategories( //
			searchString:string //
		):void {

		}
	}

	angular.module('organizator').controller('AddCategoriesToActionController', AddCategoriesToActionController);
}
