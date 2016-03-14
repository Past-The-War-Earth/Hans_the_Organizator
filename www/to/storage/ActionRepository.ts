///<reference path="../imports.ts"/>
/**
 * Created by artem on 3/27/15.
 */

module to.storage {
  var NEW_ACTION_ID = '0';

  export class ActionRepository extends CachedRepository<to.model.Action> {

    newAction:to.model.Action;
    archive;

    constructor
    (
      $ionicPopup,
      pouchDB
    ) {
      super($ionicPopup, 'action_', pouchDB);
      this.archive = pouchDB('archive');
      this.setBrandNewAction();
    }

    getBrandNewAction():to.model.Action {
      return this.newAction;
    }

    copyActionToNew( action:to.model.Action ) {
      this.newAction = this.copyAction(action);
    }

    copyAction( action:to.model.Action ):to.model.Action {
      var newAction = this.getBrandNewAction();
      newAction.categoryIds = action.categoryIds.slice();
      newAction.estimationBased = action.estimationBased;
      newAction.motivationIds = action.motivationIds.slice();
      newAction.phrase = action.phrase;
      newAction.priority = action.priority;
      newAction.verbBased = action.verbBased;

      return newAction;
    }

    setBrandNewAction() {
      this.newAction = this.getNewAction();
    }

    getNewAction():to.model.Action {
      var today = to.common.getStartOfDayDate();
      return {
        _id: NEW_ACTION_ID,
        adviceIds: [],
        afterActionIds: [],
        archived: false,
        beforeActionIds: [],
        categoryIds: [],
        createdDate: today,
        dueDate: today,
        doneDate: undefined,
        estimationBased: true,
        kanbanState: 0,
        lastNumDaysInPlanning: 0,
        lastNumDaysInProgress: 0,
        lastNumDaysInReady: 0,
        motivationIds: [],
        states: [],
        numBackMoves: 0,
        numDaysInPlanning: 0,
        numDaysInProgress: 0,
        numDaysInReady: 0,
        originalPlannedDate: today,
        phrase: '',
        plannedDate: today,
        priority: '2',
        type: 'action',
        updatedDate: today,
        verbBased: false
      };
    }

    getReadyActions
    (
      urgencies,
      priorities,
      categoryId,
      motivationId
    ):Promise<to.model.Action[]> {
      return this.getByParameters(urgencies, priorities, to.common.Kanban.Ready, categoryId, motivationId);
    }

    getInProgressActions
    (
      urgencies,
      priorities,
      categoryId,
      motivationId
    ):Promise<to.model.Action[]> {
      return this.getByParameters(urgencies, priorities, to.common.Kanban.InProgress, categoryId, motivationId);
    }

    getRecentlyDoneActions
    (
      urgencies,
      priorities,
      categoryId,
      motivationId
    ):Promise<to.model.Action[]> {
      return this.getByParameters(urgencies, priorities, to.common.Kanban.RecentlyDone, categoryId, motivationId);
    }

    get( actionId:string ):Promise<to.model.Action> {
      if (actionId === NEW_ACTION_ID) {
        return new Promise(( resolve )=> {
          resolve(this.newAction);
        });
      }
      return super.get(actionId);
    }

    protected preSave(
      action:to.model.Action,
      today:Date
    ) {
      this.setBrandNewAction();
      action.states.push({
        number: 1,
        fromDate: today,
        state: to.common.Kanban.Planned
      });
    }

    update(
      action:to.model.Action
    ):Promise<to.model.Action> {
      if (action.kanbanState == to.common.Kanban.Archived) {
        action.archivedDate = to.common.getStartOfDayDate();
        return this.toArchive(action);
      } else {
        return super.update(action);
      }
    }

    toArchive
    ( action:to.model.Action ):Promise<to.model.Action> {
      var currentAction:to.model.Action = this.mapById[action._id];
      if (!currentAction) {
        throw 'Could not find action with Id: ' + action._id;
      }
      return this.db.get(action._id).then(( doc )=> {
        return this.db.remove(doc);
      }).then(()=> {
        delete this.mapById[action._id];
        this.objects.slice(currentAction.cacheIndex, 1);
        action._id = 'archive_' + to.common.getCurrentDateTimestamp();
        delete action._rev;
        return this.archive.put(action).then(( record )=> {
          return action;
        });
      }).catch(( error:DbError )=> {
        this.$ionicPopup.alert({
          title: 'Database Error',
          template: 'Error archiving action.'
        });
      });
    }

    getByParameters
    (
      urgencies,
      priorities,
      kanbanState,
      categoryId,
      motivationId
    ):Promise<to.model.Action[]> {
      if (urgencies != to.common.Urgency.All) {
        urgencies = urgencies.split(',');
      }
      if (priorities != to.common.Priority.All) {
        priorities = priorities.split(',');
      }
      return this.getAll().then(( actions )=> {
        return actions.filter(( action:to.model.Action )=> {
          return (urgencies == to.common.Urgency.All || urgencies.indexOf(to.common.getUrgencyOfAction(action).toString()) >= 0)
            && (priorities == to.common.Priority.All || priorities.indexOf(action.priority.toString()) >= 0)
            && ((kanbanState == to.common.Kanban.AllIncomplete && action.kanbanState < to.common.Kanban.RecentlyDone)
            || action.kanbanState == kanbanState)
            && (categoryId == 0 || action.categoryIds.indexOf(categoryId) >= 0)
            && (motivationId == 0 || action.motivationIds.indexOf(motivationId) >= 0);
        });
      });
    }

    getAllIncomplete():Promise<to.model.Action[]> {
      return this.getByParameters("5", "5", "5", "0", "0");
    }

    getAllPlanned():Promise<to.model.Action[]> {
      return this.getByParameters("5", "5", "0", "0", "0");
    }


  }
  angular.module('organizator').service('actionRepository', ActionRepository);
}
