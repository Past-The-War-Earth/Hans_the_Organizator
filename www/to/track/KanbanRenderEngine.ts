///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/3/2016.
 */

module to.track {

  import year = d3.time.year;

  export interface ActionRendering {
    action:to.model.Action;
    classes:any;
    color:string; // fill
    connectionMap:{[otherActionId:number]:ConnectionRendering};
    getTransform():string;
    radius:number; // r
    x:number; // translate(x,)
    y:number; // translate(,y)
  }

  export interface ConnectionRendering {
    classes:any;
    count:number;
    fromAction:ActionRendering;
    toAction:ActionRendering;
  }

  export class RenderedAction implements ActionRendering {

    classes:any;
    connectionMap:{[otherActionId:number]:ConnectionRendering} = {};

    constructor(
      public action:to.model.Action,
      borderClass:string,
      public color:string,
      public radius:number,
      public x:number,
      public y:number
    ) {
      this.classes = {};
      this.classes[borderClass] = true;
    }

    getTransform():string {
      return `translate(${this.x},${this.y})`;
    }
  }

  export class RenderedConnection implements ConnectionRendering {

    count:number;

    constructor(
      public classes:any,
      public fromAction:ActionRendering,
      public toAction:ActionRendering
    ) {
      this.count = 1;
    }

  }

  export class KanbanRendering {

    columnWidth:number;
    maxActionRadius:number;
    allRenderedActions:ActionRendering[];
    maxVerticalNumActions:number;
    renderedActionMap:{[id:number]:ActionRendering} = {};
    allConnections:ConnectionRendering[];

    constructor(
      private readyActions:to.model.Action[],
      private inProgressActions:to.model.Action[],
      private recentlyDoneActions:to.model.Action[],
      private actionMap:storage.ObjectMap<model.Action>
    ) {
      this.columnWidth = this.getColumnWidth();
      this.maxActionRadius = this.getMaxActionRadius(this.columnWidth);

      let renderedReadyActions = this.computeActionAttributes(readyActions, 'ready-action', 0);
      let renderedInProgressActions = this.computeActionAttributes(inProgressActions, 'in-progress-action', 1);
      let renderedRecentlyDoneActions = this.computeActionAttributes(recentlyDoneActions, 'recently-done-action', 2);
      let renderedActions = [];

      this.maxVerticalNumActions = Math.max(renderedReadyActions.length, renderedInProgressActions.length, renderedRecentlyDoneActions.length);

      renderedActions = renderedActions.concat(renderedReadyActions);
      renderedActions = renderedActions.concat(renderedInProgressActions);
      renderedActions = renderedActions.concat(renderedRecentlyDoneActions);

      this.allRenderedActions = renderedActions;

      this.allConnections = this.computeActionConnections();
    }

    computeActionAttributes(
      actions:to.model.Action[],
      borderClass:string,
      columnPosition:number
    ):ActionRendering[] {
      let renderedActions:ActionRendering[] = [];

      let positionRadius = Math.floor(this.columnWidth / 2);

      let tempIndex = 0;
      actions.forEach((
        action:to.chart.BubbleAction
      ) => {
        action.urgency = to.common.getUrgencyOfAction(action);
        let color = to.chart.bubble.getNodeFill(action);
        let radius = to.chart.bubble.getNodeRadius(action);
        let x = columnPosition * this.columnWidth + positionRadius;
        let y = 25 + tempIndex * this.columnWidth + positionRadius;
        let renderedAction = new RenderedAction(action, borderClass, color, radius, x, y);
        tempIndex++;
        this.renderedActionMap[action._id] = renderedAction;
        renderedActions.push(renderedAction);
      });

      return renderedActions;
    }

    computeActionConnections():ConnectionRendering[] {
      let renderedConnections = [];

      // Compute connections between Ready and In Progress actions
      this.allRenderedActions.forEach((
        renderedAction:ActionRendering
      ) => {
        let action = renderedAction.action;
        if (action.beforeActionIds) {
          action.beforeActionIds.forEach(( fromActionId ) => {
            let fromAction = this.actionMap[fromActionId];
            // If from action is in Archive
            if (!fromAction) {
              return;
            }
            let renderedFromAction = this.renderedActionMap[fromActionId];
            // If from action is not rendered - is in planning
            if (!renderedFromAction) {
              return;
            }
            let existingConnection = renderedFromAction.connectionMap[action._id];
            // Connection already exists
            if (existingConnection) {
              renderedAction.connectionMap[fromActionId] = existingConnection;
              return;
            }
            // Create a new connection
            let classes = this.getConnectionClasses(renderedFromAction);
            let renderedConnection = new RenderedConnection(classes, renderedFromAction, renderedAction);
            renderedAction.connectionMap[fromActionId] = renderedConnection;
            renderedFromAction.connectionMap[action._id] = renderedConnection;

            renderedConnections.push(renderedConnection);
          });
        }
        if (action.afterActionIds) {
          action.afterActionIds.forEach(( toActionId ) => {
            let toAction = this.actionMap[toActionId];
            // If after action is in Archive
            if (!toAction) {
              return;
            }
            let renderedToAction = this.renderedActionMap[toActionId];
            // If after action is not rendered
            if (!renderedToAction) {
              return;
            }
            let existingConnection = renderedToAction.connectionMap[action._id];
            // Connection already exists
            if (existingConnection) {
              renderedAction.connectionMap[toActionId] = existingConnection;
              return;
            }
            // Create a new connection
            let classes = this.getConnectionClasses(action);
            let renderedConnection = new RenderedConnection(classes, renderedAction, renderedToAction);
            renderedAction.connectionMap[toActionId] = renderedConnection;
            renderedToAction.connectionMap[action._id] = renderedConnection;

            renderedConnections.push(renderedConnection);
          })
        }
      });

      return renderedConnections;
    }

    getConnectionClasses(
      fromAction:model.Action
    ) {
      // Create a new connection
      let classes = {};
      switch (parseInt(fromAction.kanbanState)) {
        case common.Kanban.Ready:
          classes['ready-action'] = true;
          break;
        case common.Kanban.InProgress:
          classes['in-progress-action'] = true;
          break;
        case common.Kanban.RecentlyDone:
          classes['done-action'] = true;
          break;
      }

      return classes;
    }

    getActions():ActionRendering[] {
      return this.allRenderedActions;
    }

    getConnections():ConnectionRendering[] {
      return this.allConnections;
    }

    getChartHeight():number {
      return this.maxVerticalNumActions * this.columnWidth;
    }

    getColumnWidth():number {
      return Math.floor(Math.min(window.innerHeight, window.innerWidth) / 3);
    }

    getMaxActionRadius( //
      columnWidth:number //
    ):number {
      return Math.floor(columnWidth / 3 * 2);
    }

    getOffset(
      columnWidth:number,
      radius:number
    ):number {
      return Math.floor(columnWidth / 2 - radius);
    }

  }
}
