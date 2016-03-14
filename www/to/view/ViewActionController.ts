///<reference path="../imports.ts"/>
/**
 * Created by artem on 6/2/15.
 */

module to.enter {

  interface StateTransition {
    state:string;
    date:string;
  }

  class ViewActionController extends to.common.ActionController {

    deferred:ViewActionController;
    asParagraph:boolean = false;
    dueValue:number;
    dueRemainderDays:number;
    newKanbanState:any = this.Kanban.Planned;
    urgency:number;

    constructor
    (
      $ionicHistory,
      private $ionicPopup,
      $scope:angular.IScope,
      $state:angular.ui.IStateService,
      private $stateParams:to.common.ActionDetailParameters,
      private actionRepository:to.storage.ActionRepository,
      actionService:to.act.ActionService,
      private archiveRepository:to.storage.ArchiveRepository,
      categoryRepository:to.storage.CategoryRepository,
      motivationRepository:to.storage.MotivationRepository
    ) {
      super($ionicHistory, $scope, $state, actionService, categoryRepository, motivationRepository, 'ViewActionController', 'Action');
      this.reload();
    }

    reload():Promise<any> {
      return super.reload().then(()=> {
        var promise;
        if (this.$stateParams.archive) {
          promise = this.archiveRepository.get(this.$stateParams.actionId);
        } else {
          promise = this.actionRepository.get(this.$stateParams.actionId);
        }
        promise.then(( action:to.model.Action )=> {
          this.action = action;
          var operations:Promise<any>[] =
            [this.categoryRepository.getAllByIds(this.action.categoryIds),
              this.motivationRepository.getAllByIds(this.action.motivationIds),
              this.actionRepository.getAllByIds(this.action.beforeActionIds),
              this.actionRepository.getAllByIds(this.action.afterActionIds)];
          Promise.all(operations).then(( results )=> {
            this.categories = results[0];
            this.motivations = results[1];
            this.beforeActions = results[2];
            this.afterActions = results[3];
            // TODO: FIXME: load remaining Before and After actions from Archive
            this.asParagraph = action.verbBased;
            this.deferred = this;
            if (!this.$stateParams.archive) {
              to.common.setDueValueAndUrgency(this, this.action);
            }
            this.afterDataLoad();
          });
        });
      });
    }

    getDisplayTypeHtml():string {
      return this.asParagraph ? 'In writing' : 'Itemized';
    }

    getDisplayTypeClass() {
      return this.asParagraph ? 'icon-quill' : 'icon-list2';
    }

    changeDisplayType() {
      this.asParagraph = !this.asParagraph;
    }


    getParagraphHtml() {
      var state = to.common.getKanbanState(this.action.kanbanState);

      var belongsTo = '';
      if (this.categories && this.categories.length) {
        belongsTo = this.asPartOfLabel();
      }
      // TODO: change to Who instead of I once groups are added
      var action = super.getInputValue(`I ${this.actionOptions[this.action.priority]}`);

      var paragraph = '';

      if (this.motivations && this.motivations.length) {
        paragraph += '<p> Because of ' + super.getInputValue(this.getMotivationsList()) + '</p>';
      }
      paragraph += `<p>${action} ${this.action.phrase}</p>`;

      if (belongsTo) {
        paragraph += `<p>${belongsTo}</p>`;

      }

      paragraph += `<p>${this.getDueFragment()}</p>`;

      var sinceDate = this.getSinceDate();

      paragraph += `<p>It has been ${state} since ${sinceDate}.</p>`;

      return paragraph;
    }

    getDueFragment() {
      var dueFragment;
      if (this.action.kanbanState < to.common.Kanban.RecentlyDone) {
        var duePeriod = this.getDuePeriod();
        dueFragment = 'It is due';
        if (this.dueValue > 0) {
          dueFragment += ` in ${this.dueValue} ${duePeriod}`;
          if (this.dueRemainderDays > 0) {
            dueFragment += ` and ${this.dueRemainderDays} days (${this.action.dueDate.toLocaleDateString()}).`
          }
        } else {
          dueFragment += ' Now.';
        }
      } else {
        dueFragment = 'It was due ' + this.action.dueDate.toLocaleDateString();
      }

      return dueFragment;
    }

    getUrgencyClassOrDone() {
      if (this.action.kanbanState < to.common.Kanban.RecentlyDone) {
        return this.getUrgencyClass(this.action);
      } else {
        return 'fa-ship';
      }
    }

    getStateName( actionState:to.model.ActionState ) {
      return to.common.getKanbanState(actionState.state);
    }

    getPriorityLabel() {
      return `It is ${to.common.getPriorityLabel(this.action.priority)}`;
    }

    getNumDaysInState( actionState:to.model.ActionState ) {
      if (actionState.number === this.action.states.length) {
        return to.common.getNumDaysSinceDate(actionState.fromDate) + ' days';
      } else {
        return actionState.numDays + ' days';
      }
    }

    getStateDetails( actionState:to.model.ActionState ) {
      return `${this.getStateName(actionState)} (${this.getNumDaysInState(actionState)})`;
    }

    getMoveToStateDate( actionState:to.model.ActionState ) {
      return actionState.fromDate.toLocaleDateString();
    }

    changeState() {
      this.$ionicPopup.show({
        templateUrl: 'to/view/MoveActionStatePopupView.html',
        title: 'Move Action to',
        scope: this.$scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Move</b>',
            type: 'button-positive',
            onTap: ( e ) => {
              this.newKanbanState = parseInt(this.newKanbanState);
              this.changeActionState(this.newKanbanState);
              return true;
            }
          }
        ]
      });
    }

    changeActionState( newState:number ) {
      var currentKanbanState = parseInt(this.action.kanbanState);
      if (newState != currentKanbanState) {
        this.actionService.changeKanbanState(this.action, newState - currentKanbanState);
      }
      this.back();
    }

    edit() {
      this.editAction(this.action);
    }

    copy() {
      this.actionRepository.copyActionToNew(this.action);
      this.$state.go(to.common.states.ENTER_ACTION, {brandNew: 'N'});
    }

    viewCategory( category:to.model.Category ) {
      this.$state.go(to.common.states.VIEW_CATEGORY, {id: category._id});
    }

    viewMotivation( motivation:to.model.Motivation ) {
      this.$state.go(to.common.states.VIEW_MOTIVATION, {id: motivation._id});
    }

    share() {
      // TODO: add sharing
    }

    getSinceDate():string {
      switch (parseInt(this.action.kanbanState)) {
        case to.common.Kanban.Planned:
          return this.action.createdDate.toLocaleDateString();
        case to.common.Kanban.Ready:
          return this.action.readyDate.toLocaleDateString();
        case to.common.Kanban.InProgress:
          return this.action.startDate.toLocaleDateString();
        case to.common.Kanban.RecentlyDone:
        case to.common.Kanban.Archived:
          return this.action.doneDate.toLocaleDateString();
      }
    }

    getDuePeriod():string {
      return to.common.getUrgencyLabel(this.urgency);
    }

    isIncompleteAction():boolean {
      switch (parseInt(this.action.kanbanState)) {
        case this.Kanban.Archived:
        case this.Kanban.RecentlyDone:
          return false;
      }
      return true;
    }

    canRemoveBeforeAction(
      action:to.model.Action
    ):boolean {
      return false;
    }

    canRemoveAfterAction(
      action:to.model.Action
    ):boolean {
      return false;
    }

  }

  angular.module('organizator').controller('ViewActionController', ViewActionController);
}
