///<reference path="../imports.ts"/>
/**
 * Created by artem on 4/9/15.
 */

module to.enter {

  class EditActionController extends to.common.EditableActionController {

    constructor
    (
      $ionicHistory,
      $scope:angular.IScope,
      $state:angular.ui.IStateService,
      private $stateParams:to.common.ActionDetailParameters,
      private actionRepository:to.storage.ActionRepository,
      actionService:to.act.ActionService,
      categoryRepository:to.storage.CategoryRepository,
      motivationRepository:to.storage.MotivationRepository
    ) {
      super($ionicHistory, $scope, $state, actionService, categoryRepository, motivationRepository, 'EditActionController', 'Action');
      this.reload();
    }

    reload():Promise<any> {
      return super.reload().then(()=> {
        this.actionRepository.get(this.$stateParams.actionId).then(( action )=> {
          this.action = action;
          if (!this.action) {
            return;
          }
          to.common.setDueValueAndUrgency(this, this.action);
          var operations:Promise<any>[] = [
            this.categoryRepository.getAllByIds(this.action.categoryIds),
            this.motivationRepository.getAllByIds(this.action.motivationIds),
            this.actionRepository.getAllByIds(this.action.beforeActionIds),
            this.actionRepository.getAllByIds(this.action.afterActionIds)];
          Promise.all(operations).then(( results )=> {
            this.categories = results[0];
            this.motivations = results[1];
            this.beforeActions = results[2];
            this.afterActions = results[3];
            // TODO: FIXME: load remaining Before and After actions from Archive
            this.afterDataLoad();
            var unbindHandler = this.$scope.$on('$ionicView.beforeLeave', (
              event,
              stateParams
            )=> {
              this.convertRanges();
              this.actionRepository.update(this.action);
              unbindHandler();
            });
          });
        });
      });
    }

    operateOnAction() {
      this.convertRanges();
      this.actionRepository.update(this.action).then(()=> {
        this.back();
      });
    }

    operateOnActionLabel() {
      return 'Save';
    }

  }

  angular.module('organizator').controller('EditActionController', EditActionController);
}
