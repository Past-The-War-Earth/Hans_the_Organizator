///<reference path="../imports.ts"/>
/**
 * Created by artem on 4/11/15.
 */

module to.track {

  class KanbanController extends to.common.ActionsController {

    //private readyActions:to.model.Action[];
    //private inProgressActions:to.model.Action[];
    //private recentlyDoneActions:to.model.Action[];
    private allConnections:ConnectionRendering[];
    private allRenderedActions:ActionRendering[];
    private chartHeight:number;
    private selectedAction:ActionRendering;
    private svgTopPosition:number = 0;
    actions:to.model.Action[];
    currentState;
    showStateNavigation:boolean = false;

    constructor
    (
      private $ionicActionSheet,
      $ionicHistory,
      $scope:angular.IScope,
      $state:angular.ui.IStateService,
      private $stateParams,
      private actionRepository:to.storage.ActionRepository,
      private actionService:to.act.ActionService,
      categoryRepository:to.storage.CategoryRepository,
      motivationRepository:to.storage.MotivationRepository
    ) {
      super($ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'KanbanController', 'Progress');
      this.reload();
    }

    reload():Promise<any> {
      var urgencies = this.$stateParams.urgencies;
      var priorities = this.$stateParams.priorities;
      var categoryId = this.$stateParams.categoryId;
      var motivationId = this.$stateParams.motivationId;
      var operations:Promise<any>[] =
        [this.actionRepository.getMap(),
          this.actionRepository.getReadyActions(urgencies, priorities, categoryId, motivationId),
          this.actionRepository.getInProgressActions(urgencies, priorities, categoryId, motivationId),
          this.actionRepository.getRecentlyDoneActions(urgencies, priorities, categoryId, motivationId)];
      return Promise.all(operations).then(( results )=> {
        let actionMap:storage.ObjectMap<model.Action> = results[0];
        let readyActions = results[1];
        let inProgressActions = results[2];
        let recentlyDoneActions = results[3];
        let rendering = new KanbanRendering(readyActions, inProgressActions, recentlyDoneActions, actionMap);
        this.allRenderedActions = rendering.getActions();
        this.allConnections = rendering.getConnections();
        this.chartHeight = rendering.getChartHeight();
        this.afterDataLoad();
      });
    }

    onActionRenderingClick( //
      actionRendering:ActionRendering //
    ):void {
      if (!this.selectedAction) {
        this.svgTopPosition = this.svgTopPosition + 96;
      }
      if (this.selectedAction) {
        this.selectedAction.classes['selected-action'] = false;
        for (var actionId in this.selectedAction.connectionMap) {
          let connection = this.selectedAction.connectionMap[actionId];
          connection.classes['selected-action'] = false;
        }
      }

      this.selectedAction = actionRendering;
      let action = this.selectedAction.action;
      this.actions = [action];

      actionRendering.classes['selected-action'] = true;
      for (var actionId in actionRendering.connectionMap) {
        let connection = actionRendering.connectionMap[actionId];
        connection.classes['selected-action'] = true;
      }

      switch (parseInt(action.kanbanState)) {
        case common.Kanban.Ready:
          this.onReadyClick(action);
          break;
        case common.Kanban.InProgress:
          this.onInProgressClick(action);
          break;
        case common.Kanban.RecentlyDone:
          this.onRecentlyDoneClick(action);
          break;
      }
    }

    onReadyClick( readyAction:to.model.Action ) {
      this.hideStateNavigation();
      this.$ionicActionSheet.show({
        buttons: [
          {text: this.getMoveToLabel(to.common.Kanban.InProgress)},
          {text: this.getMoveToLabel(to.common.Kanban.Planned)},
          {text: 'View'},

        ],
        titleText: readyAction.phrase,
        cancelText: 'Cancel',
        buttonClicked: ( index:number ) => {
          this.actionSheetButtonClick(readyAction, index);
          return true;
        }
      });
    }


    // FIXME: test the start and done date code in archive


    actionSheetButtonClick(
      action:to.model.Action,
      index:number
    ) {
      switch (index) {
        case 0:
          this.actionService.changeKanbanState(action, 1).then(()=> {
            this.reload();
            this.doneModifying();
          });
          break;
        case 1:
          if (action.kanbanState != this.Kanban.RecentlyDone) {
            this.actionService.changeKanbanState(action, -1).then(()=> {
              this.reload();
              this.doneModifying();
            });
            break;
          }
        case 2:
          var params:to.common.ActionDetailParameters = {
            actionId: action._id
          };
          this.$state.go(to.common.states.VIEW_ACTION, params);
          break;
      }
    }

    onInProgressClick( inProgressAction:to.model.Action ) {
      this.hideStateNavigation();
      this.$ionicActionSheet.show({
        buttons: [
          {text: this.getMoveToLabel(to.common.Kanban.RecentlyDone)},
          {text: this.getMoveToLabel(to.common.Kanban.Ready)},
          {text: 'View'},

        ],
        titleText: inProgressAction.phrase,
        cancelText: 'Cancel',
        buttonClicked: ( index:number ) => {
          this.actionSheetButtonClick(inProgressAction, index);
          return true;
        }
      });
    }

    onRecentlyDoneClick( recentlyDoneAction:to.model.Action ) {
      this.hideStateNavigation();
      this.$ionicActionSheet.show({
        buttons: [
          {text: this.getMoveToLabel(to.common.Kanban.Archived)},
          {text: 'View'},

        ],
        titleText: recentlyDoneAction.phrase,
        cancelText: 'Cancel',
        buttonClicked: ( index:number ) => {
          this.actionSheetButtonClick(recentlyDoneAction, index);
          return true;
        }
      });
    }

    getMoveToLabel( kanbanState:to.common.Kanban ) {
      return `Move to: ${to.common.getKanbanState(kanbanState)}`;
    }

    onStateClick
    ( kanbanState ) {
      if (!this.showStateNavigation) {
        this.svgTopPosition = this.svgTopPosition + 36;
      }
      this.currentState = kanbanState;
      this.showStateNavigation = true;
    }

    getSelectedStateClass
    ( kanbanState ) {
      return kanbanState == this.currentState ? 'selected-state' : '';
    }

    getParams() {
      var params:any = {};
      params.kanbanState = this.currentState;
      params.urgencies = this.$stateParams.urgencies;
      params.priorities = this.$stateParams.priorities;
      params.categoryId = this.$stateParams.categoryId;
      params.motivationId = this.$stateParams.motivationId;

      return params;
    }

    viewEisenhower() {
      var params = this.getParams();
      this.hideStateNavigation();
      this.$state.go(to.common.states.EISENHOWER, params);
    }

    viewCategories() {
      var params = this.getParams();
      delete params.categoryId;
      this.hideStateNavigation();
      this.$state.go(to.common.states.CATEGORIES, params);
    }

    viewMotivations() {
      var params = this.getParams();
      delete params.motivationId;
      this.hideStateNavigation();
      this.$state.go(to.common.states.MOTIVATIONS, params);
    }

    hideStateNavigation() {
      if (this.showStateNavigation) {
        this.svgTopPosition = this.svgTopPosition - 36;
      }
      this.showStateNavigation = false;
      this.currentState = null;
    }


  }

  angular.module('organizator').controller('KanbanController', KanbanController);
}
