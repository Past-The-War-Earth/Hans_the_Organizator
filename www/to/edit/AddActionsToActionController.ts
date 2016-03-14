///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/7/2016.
 */


module to.edit {

  export class AddActionsToActionController extends common.ActionsController {

    beforeActions:to.model.Action[];
    action:to.model.Action;

    categoryFilter:boolean = false;
    motivationFilter:boolean = false;
    adviceFilter:boolean = false;

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
    }

    toggleCategoryFilter():void {
      this.categoryFilter = !this.categoryFilter;
      this.filter();
    }

    toggleMotivationFilter():void {
      this.motivationFilter = !this.motivationFilter;
      this.filter();
    }

    toggleAdviceFilter():void {
      this.adviceFilter = !this.adviceFilter;
      this.filter();
    }

    canRemoveBeforeAction(
      action:to.model.Action
    ):boolean {
      return false;
    }

  }

}
