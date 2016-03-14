///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/4/2016.
 */

module to.edit {

  export class AddBeforeActionsToActionController extends common.ActionsController {

    beforeActions:to.model.Action[];
    action:to.model.Action;

    categoryFilter:boolean = false;
    motivationFilter:boolean = false;
    adviceFilter:boolean = false;

    toggleMotivationBackgroundClass:any = {};
    toggleCategoryBackgroundClass:any = {};
    toggleAdviseBackgroundClass:any = {};

    constructor
    (
      private $ionicActionSheet,
      $ionicHistory,
      $scope:angular.IScope,
      $state:angular.ui.IStateService,
      private $stateParams:to.common.ActionDetailParameters,
      private actionRepository:to.storage.ActionRepository,
      private actionService:to.act.ActionService,
      categoryRepository:to.storage.CategoryRepository,
      motivationRepository:to.storage.MotivationRepository
    ) {
      super($ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'AddBeforeActionsToActionController', 'Add Do Before');

      this.reload();
    }

    reload():Promise<any> {
      return this.actionRepository.get(this.$stateParams.actionId).then(( action )=> {
        this.action = action;
        this.actionService.getCandidatesForBeforeAction(action, this.categoryFilter, this.motivationFilter, this.adviceFilter).then(( candidateActions ) => {
          this.beforeActions = candidateActions;
          this.afterDataLoad();
        });
      });
    }

    private filter():void {
      this.actionService.getCandidatesForBeforeAction(this.action, this.categoryFilter, this.motivationFilter, this.adviceFilter).then(( candidateActions ) => {
        this.beforeActions = candidateActions;
        this.$scope.$apply();
      });
    }

    toggleCategoryFilter():void {
      this.categoryFilter = !this.categoryFilter;
      this.setBackgrounds(false, this.categoryFilter, false);
      this.filter();
    }


    toggleMotivationFilter():void {
      this.motivationFilter = !this.motivationFilter;
      this.setBackgrounds(this.motivationFilter, false, false);
      this.filter();
    }

    setBackgrounds(
      reasons:boolean,
      categories:boolean,
      advise:boolean
    ):void {
      this.toggleMotivationBackgroundClass['background-reasons'] = reasons;
      this.toggleCategoryBackgroundClass['background-categories'] = categories;
      this.toggleAdviseBackgroundClass['background-advise'] = advise;
    }

    toggleAdviseFilter():void {
      this.adviceFilter = !this.adviceFilter;
      this.setBackgrounds(false, false, this.adviceFilter);
      this.filter();
    }

    canRemoveBeforeAction(
      action:to.model.Action
    ):boolean {
      return false;
    }

    selectAction(
      action:to.model.Action
    ):void {
      this.actionService.addBeforeAction(this.action, action).then(() => {
        this.back();
      });
    }

    getNoLaterStepsMessage() {
      return 'No Later steps available';
    }

  }

  angular.module('organizator').controller('AddBeforeActionsToActionController', AddBeforeActionsToActionController);

}
