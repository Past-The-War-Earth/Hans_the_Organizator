///<reference path="../imports.ts"/>

/**
 * Created by artem on 5/15/15.
 */

module to.act {

  import Kanban = to.common.Kanban;
  export class ActionService {

    constructor
    (
      private actionRepository:to.storage.ActionRepository,
      private categoryRepository:to.storage.CategoryRepository,
      private motivationRepository:to.storage.MotivationRepository
    ) {
      //setTimeout(()=> {
      //	this.upgrade();
      //}, 3000);
    }

    upgrade() {
      this.categoryRepository.getAll().then(( categories )=> {
        categories.forEach(( category:to.model.Category )=> {
          category.numReadyActions = 0;
          category.numInProgressActions = 0;
          this.categoryRepository.update(category);
        });
      });
      this.motivationRepository.getAll().then(( motivations )=> {
        motivations.forEach(( motivation:to.model.Motivation )=> {
          motivation.numReadyActions = 0;
          motivation.numInProgressActions = 0;
          this.motivationRepository.update(motivation);
        });
      });
    }

    readyAction
    ( action:to.model.Action ):Promise<to.model.Action> {
      return this.changeKanbanState(action, 1);
    }

    private updateCounts
    (
      action:to.model.Action,
      plannedCountDelta:number,
      readyCountDelta:number,
      inProgressCountDelta:number,
      completeCountDelta:number
    ) {
      action.motivationIds.forEach(( motivationId:string )=> {
        this.motivationRepository.get(motivationId).then(( motivation )=> {
          motivation.numCompleteActions += completeCountDelta;
          motivation.numInProgressActions += inProgressCountDelta;
          motivation.numReadyActions += readyCountDelta;
          motivation.numPlannedActions += plannedCountDelta;
          this.motivationRepository.update(motivation);
        });
      });
      action.categoryIds.forEach(( categoryId:string )=> {
        this.categoryRepository.get(categoryId).then(( category )=> {
          category.numCompleteActions += completeCountDelta;
          category.numInProgressActions += inProgressCountDelta;
          category.numReadyActions += readyCountDelta;
          category.numPlannedActions += plannedCountDelta;
          this.categoryRepository.update(category);
        });
      });
    }

    private decreaseNumMoves( numMoves:number ) {
      if (numMoves < 0) {
        return ++numMoves;
      } else if (numMoves > 0) {
        return --numMoves;
      }
      return 0;
    }

    changeKanbanState
    (
      action:to.model.Action,
      moves:number,
      originalCall:boolean = true,
      originalState:number = parseInt(action.kanbanState),
      isBackMove:boolean = (moves > 0)
    ):Promise<to.model.Action> {
      if (moves == 0) {
        var today = to.common.getStartOfDayDate();
        switch (action.kanbanState) {
          case to.common.Kanban.Planned:
            action.plannedDate = today;
            break;
          case to.common.Kanban.Ready:
            if (!action.originalReadyDate) {
              action.originalReadyDate = today;
            }
            action.readyDate = today;
            break;
          case to.common.Kanban.InProgress:
            if (!action.originalStartDate) {
              action.originalStartDate = today;
            }
            action.startDate = today;
            break;
          case to.common.Kanban.RecentlyDone:
            if (!action.originalDoneDate) {
              action.originalDoneDate = today;
            }
            action.doneDate = today;
            break;
        }

        var lastState = action.states[action.states.length - 1];
        var numDaysInLastState = to.common.getNumDaysSinceDate(lastState.fromDate);
        lastState.numDays = numDaysInLastState;
        var state:to.model.ActionState = {
          number: action.states.length + 1,
          fromDate: today,
          state: action.kanbanState
        };
        action.states.push(state);

        action.kanbanState = action.kanbanState.toString();
        return this.actionRepository.update(action);
      }
      if (originalCall && moves < 0) {
        action.numBackMoves++;
      }
      action.kanbanState = parseInt(action.kanbanState);
      var oldState = action.kanbanState;
      action.kanbanState += (moves > 0) ? 1 : -1;
      switch (oldState) {
        case to.common.Kanban.Planned:
          this.updateCounts(action, -1, 1, 0, 0);
          if (originalCall) {
            action.lastNumDaysInPlanning = to.common.getNumDaysSinceDate(action.plannedDate);
            action.numDaysInPlanning += to.common.getNumDaysSinceDate(action.plannedDate);
          }
          break;
        case to.common.Kanban.Ready:
          if (moves > 0) {
            this.updateCounts(action, 0, -1, 1, 0);
          } else {
            this.updateCounts(action, 1, -1, 0, 0);
          }
          if (originalCall) {
            action.lastNumDaysInReady = to.common.getNumDaysSinceDate(action.readyDate);
            action.numDaysInReady += to.common.getNumDaysSinceDate(action.readyDate);
          }
          break;
        case to.common.Kanban.InProgress:
          if (moves > 0) {
            this.updateCounts(action, 0, 0, -1, 1);
          } else {
            this.updateCounts(action, 0, 1, -1, 0);
          }
          if (originalCall) {
            action.lastNumDaysInProgress = to.common.getNumDaysSinceDate(action.startDate);
            action.numDaysInProgress += to.common.getNumDaysSinceDate(action.startDate);
          }
          break;
        case to.common.Kanban.RecentlyDone:
          if (moves < 0) {
            this.updateCounts(action, 0, 0, 1, -1);
          }
          break;
      }
      return this.changeKanbanState(action, this.decreaseNumMoves(moves), false, originalState, isBackMove);
    }

    addCategory
    (
      action:to.model.Action,
      category:to.model.Category
    ) {
      action.categoryIds.push(category._id);
      switch (parseInt(action.kanbanState)) {
        case to.common.Kanban.Planned:
          category.numPlannedActions++;
          break;
        case to.common.Kanban.Ready:
          category.numReadyActions++;
          break;
        case to.common.Kanban.InProgress:
          category.numInProgressActions++;
          break;
        case to.common.Kanban.RecentlyDone:
          category.numCompleteActions++;
          break;
      }
      this.categoryRepository.update(category);
      this.actionRepository.update(action);
    }

    removeCategory
    (
      action:to.model.Action,
      category:to.model.Category
    ) {
      for (var i = 0; i < action.categoryIds.length; i++) {
        if (action.categoryIds[i] == category._id) {
          action.categoryIds.splice(i, 1);
        }
      }
      switch (parseInt(action.kanbanState)) {
        case to.common.Kanban.Planned:
          category.numPlannedActions--;
          break;
        case to.common.Kanban.Ready:
          category.numReadyActions--;
          break;
        case to.common.Kanban.InProgress:
          category.numInProgressActions--;
          break;
        case to.common.Kanban.RecentlyDone:
          category.numCompleteActions--;
          break;
      }
      this.categoryRepository.update(category);
      this.actionRepository.update(action);
    }

    addMotivation
    (
      action:to.model.Action,
      motivation:to.model.Motivation
    ) {
      action.motivationIds.push(motivation._id);
      switch (parseInt(action.kanbanState)) {
        case to.common.Kanban.Planned:
          motivation.numPlannedActions++;
          break;
        case to.common.Kanban.Ready:
          motivation.numReadyActions++;
          break;
        case to.common.Kanban.InProgress:
          motivation.numInProgressActions++;
          break;
        case to.common.Kanban.RecentlyDone:
          motivation.numCompleteActions++;
          break;
      }
      this.motivationRepository.update(motivation);
      this.actionRepository.update(action);
    }

    addBeforeAction(
      toAction:to.model.Action,
      beforeAction:to.model.Action
    ):Promise<any> {
      toAction.beforeActionIds = toAction.beforeActionIds ? toAction.beforeActionIds : [];
      beforeAction.afterActionIds = beforeAction.afterActionIds ? beforeAction.afterActionIds : [];
      toAction.beforeActionIds.push(beforeAction._id);
      beforeAction.afterActionIds.push(toAction._id);
      return this.actionRepository.update(toAction).then(()=> {
        return this.actionRepository.update(beforeAction);
      });
    }

    removeBeforeAction(
      fromAction:to.model.Action,
      beforeAction:to.model.Action
    ):Promise<any> {
      let beforeActionIdIndex = fromAction.beforeActionIds.indexOf(beforeAction._id);
      if (beforeActionIdIndex >= 0) {
        fromAction.beforeActionIds.splice(beforeActionIdIndex, 1);
      }
      let afterActionIdIndex = beforeAction.afterActionIds.indexOf(fromAction._id);
      if (afterActionIdIndex >= 0) {
        beforeAction.afterActionIds.splice(afterActionIdIndex, 1);
      }
      return this.actionRepository.update(beforeAction).then(()=> {
        return this.actionRepository.update(fromAction);
      });
    }

    getCandidatesForBeforeAction(
      targetAction:to.model.Action,
      matchCategories:boolean = false,
      matchMotivations:boolean = false,
      matchAdvice:boolean = false
    ):Promise<to.model.Action[]> {
      let targetMotivationsById = {};
      let motivationIds = targetAction.motivationIds ? targetAction.motivationIds : [];
      motivationIds.forEach(( motivationId ) => {
        targetMotivationsById[motivationId] = true;
      });
      let targetCategoriesById = {};
      let categoryIds = targetAction.categoryIds ? targetAction.categoryIds : [];
      categoryIds.forEach(( categoryId ) => {
        targetCategoriesById[categoryId] = true;
      });
      let targetAdviceById = {};
      let adviceIds = targetAction.adviceIds ? targetAction.adviceIds : [];
      adviceIds.forEach(( adviceId ) => {
        targetAdviceById[adviceId] = true;
      });
      return this.actionRepository.getMap().then((
        actionMap:{[id:number]:to.model.Action}
      ) => {
        if (targetAction.kanbanState == common.Kanban.RecentlyDone) {
          return [];
        }
        let candidatesForBeforeAction = [];
        for (var id in actionMap) {
          if (id === targetAction._id) {
            continue;
          }
          let candidateAction = actionMap[id];
          if (targetAction.kanbanState < candidateAction.kanbanState) {
            continue;
          }
          if (targetAction.kanbanState != to.common.Kanban.Planned
            && targetAction.kanbanState == candidateAction.kanbanState) {
            continue;
          }
          if (this.isOnBeforePath(targetAction, id, actionMap)) {
            continue;
          }
          if (matchCategories && categoryIds.length > 0) {
            let hasAMatchingCategory = candidateAction.categoryIds.some(( categoryId ) => {
              if (targetCategoriesById[categoryId]) {
                return true;
              }
            });
            if (!hasAMatchingCategory) {
              continue;
            }
          }
          if (matchMotivations && motivationIds.length > 0) {
            let hasAMatchingMotivation = candidateAction.motivationIds.some(( motivationId ) => {
              if (targetMotivationsById[motivationId]) {
                return true;
              }
            });
            if (!hasAMatchingMotivation) {
              continue;
            }
          }
          if (matchAdvice && adviceIds.length > 0) {
            let hasMatchingAdvice = candidateAction.adviceIds.some(( adviceId ) => {
              if (targetAdviceById[adviceId]) {
                return true;
              }
            });
            if (!hasMatchingAdvice) {
              continue;
            }
          }
          candidatesForBeforeAction.push(candidateAction);
        }
        return candidatesForBeforeAction;
      });
    }

    private isOnBeforePath(
      targetAction:to.model.Action,
      candiateForBeforeActionId:string,
      actionMap:{[id:number]:to.model.Action}
    ):boolean {
      let candidateAction = actionMap[candiateForBeforeActionId];

      let beforeActionIds = targetAction.beforeActionIds ? targetAction.beforeActionIds : [];

      let isOnBeforePath = beforeActionIds.some(( beforeActionId ) => {
        if (candiateForBeforeActionId == beforeActionId) {
          return true;
        }
        let beforeAction = actionMap[beforeActionId];
        if (this.isOnBeforePath(beforeAction, candiateForBeforeActionId, actionMap)) {
          return true;
        }
      });

      return isOnBeforePath;
    }

    addAfterAction(
      toAction:to.model.Action,
      afterAction:to.model.Action
    ):Promise<any> {
      toAction.afterActionIds = toAction.afterActionIds ? toAction.afterActionIds : [];
      toAction.afterActionIds.push(afterAction._id);
      afterAction.beforeActionIds = afterAction.beforeActionIds ? afterAction.beforeActionIds : [];
      afterAction.beforeActionIds.push(toAction._id);

      return this.actionRepository.update(toAction).then(()=> {
        return this.actionRepository.update(afterAction);
      });
    }

    removeAfterAction(
      fromAction:to.model.Action,
      afterAction:to.model.Action
    ):Promise<any> {
      let afterActionIdIndex = fromAction.afterActionIds.indexOf(afterAction._id);
      if (afterActionIdIndex >= 0) {
        fromAction.afterActionIds.splice(afterActionIdIndex, 1);
      }
      let beforeActionIdIndex = afterAction.beforeActionIds.indexOf(fromAction._id);
      if (beforeActionIdIndex >= 0) {
        afterAction.beforeActionIds.splice(beforeActionIdIndex, 1);
      }

      return this.actionRepository.update(afterAction).then(()=> {
        return this.actionRepository.update(fromAction);
      });
    }

    getCandidatesForAfterAction(
      targetAction:to.model.Action,
      matchCategories:boolean = false,
      matchMotivations:boolean = false,
      matchAdvice:boolean = false
    ):Promise<to.model.Action[]> {
      let targetMotivationsById = {};
      let motivationIds = targetAction.motivationIds ? targetAction.motivationIds : [];
      motivationIds.forEach(( motivationId ) => {
        targetMotivationsById[motivationId] = true;
      });
      let targetCategoriesById = {};
      let categoryIds = targetAction.categoryIds ? targetAction.categoryIds : [];
      categoryIds.forEach(( categoryId ) => {
        targetCategoriesById[categoryId] = true;
      });
      let targetAdviceById = {};
      let adviceIds = targetAction.adviceIds ? targetAction.adviceIds : [];
      adviceIds.forEach(( adviceId ) => {
        targetAdviceById[adviceId] = true;
      });
      return this.actionRepository.getMap().then((
        actionMap:{[id:number]:to.model.Action}
      ) => {
        if (targetAction.kanbanState == common.Kanban.RecentlyDone
          || targetAction.kanbanState == common.Kanban.InProgress) {
          return [];
        }
        let candidatesForAfterAction = [];
        for (var id in actionMap) {
          if (id === targetAction._id) {
            continue;
          }
          let candidateAction = actionMap[id];
          if (targetAction.kanbanState > candidateAction.kanbanState) {
            continue;
          }
          if (targetAction.kanbanState != to.common.Kanban.Planned
            && targetAction.kanbanState == candidateAction.kanbanState) {
            continue;
          }
          if (this.isOnAfterPath(targetAction, id, actionMap)) {
            continue;
          }
          if (matchCategories && categoryIds.length > 0) {
            let hasAMatchingCategory = candidateAction.categoryIds.some(( categoryId ) => {
              if (targetCategoriesById[categoryId]) {
                return true;
              }
            });
            if (!hasAMatchingCategory) {
              continue;
            }
          }
          if (matchMotivations && motivationIds.length > 0) {
            let hasAMatchingMotivation = candidateAction.motivationIds.some(( motivationId ) => {
              if (targetMotivationsById[motivationId]) {
                return true;
              }
            });
            if (!hasAMatchingMotivation) {
              continue;
            }
          }
          if (matchAdvice && adviceIds.length > 0) {
            let hasMatchingAdvice = candidateAction.adviceIds.some(( adviceId ) => {
              if (targetAdviceById[adviceId]) {
                return true;
              }
            });
            if (!hasMatchingAdvice) {
              continue;
            }
          }
          candidatesForAfterAction.push(candidateAction);
        }

        return candidatesForAfterAction;
      });
    }

    private isOnAfterPath(
      targetAction:to.model.Action,
      candidateForAfterActionId:string,
      actionMap:{[id:number]:to.model.Action}
    ):boolean {
      let candidateAction = actionMap[candidateForAfterActionId];

      let afterActionIds = targetAction.afterActionIds ? targetAction.afterActionIds : [];
      let isOnAfterPath = afterActionIds.some(( afterActionId ) => {
        if (candidateForAfterActionId == afterActionId) {
          return true;
        }
        let beforeAction = actionMap[afterActionId];
        if (this.isOnAfterPath(beforeAction, candidateForAfterActionId, actionMap)) {
          return true;
        }
      });

      return isOnAfterPath;
    }

    removeMotivation
    (
      action:to.model.Action,
      motivation:to.model.Motivation
    ) {
      for (var i = 0; i < action.motivationIds.length; i++) {
        if (action.motivationIds[i] == motivation._id) {
          action.motivationIds.splice(i, 1);
        }
      }
      switch (parseInt(action.kanbanState)) {
        case to.common.Kanban.Planned:
          motivation.numPlannedActions--;
          break;
        case to.common.Kanban.Ready:
          motivation.numReadyActions--;
          break;
        case to.common.Kanban.InProgress:
          motivation.numInProgressActions--;
          break;
        case to.common.Kanban.RecentlyDone:
          motivation.numCompleteActions--;
          break;
      }
      this.motivationRepository.update(motivation);
      this.actionRepository.update(action);
    }
  }

  angular.module('organizator').service('actionService', ActionService);
}
