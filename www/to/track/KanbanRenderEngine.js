///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/3/2016.
 */
var to;
(function (to) {
    var track;
    (function (track) {
        var RenderedAction = (function () {
            function RenderedAction(action, borderClass, color, radius, x, y) {
                this.action = action;
                this.color = color;
                this.radius = radius;
                this.x = x;
                this.y = y;
                this.connectionMap = {};
                this.classes = {};
                this.classes[borderClass] = true;
            }
            RenderedAction.prototype.getTransform = function () {
                return "translate(" + this.x + "," + this.y + ")";
            };
            return RenderedAction;
        }());
        track.RenderedAction = RenderedAction;
        var RenderedConnection = (function () {
            function RenderedConnection(classes, fromAction, toAction) {
                this.classes = classes;
                this.fromAction = fromAction;
                this.toAction = toAction;
                this.count = 1;
            }
            return RenderedConnection;
        }());
        track.RenderedConnection = RenderedConnection;
        var KanbanRendering = (function () {
            function KanbanRendering(readyActions, inProgressActions, recentlyDoneActions, actionMap) {
                this.readyActions = readyActions;
                this.inProgressActions = inProgressActions;
                this.recentlyDoneActions = recentlyDoneActions;
                this.actionMap = actionMap;
                this.renderedActionMap = {};
                this.columnWidth = this.getColumnWidth();
                this.maxActionRadius = this.getMaxActionRadius(this.columnWidth);
                var renderedReadyActions = this.computeActionAttributes(readyActions, 'ready-action', 0);
                var renderedInProgressActions = this.computeActionAttributes(inProgressActions, 'in-progress-action', 1);
                var renderedRecentlyDoneActions = this.computeActionAttributes(recentlyDoneActions, 'recently-done-action', 2);
                var renderedActions = [];
                this.maxVerticalNumActions = Math.max(renderedReadyActions.length, renderedInProgressActions.length, renderedRecentlyDoneActions.length);
                renderedActions = renderedActions.concat(renderedReadyActions);
                renderedActions = renderedActions.concat(renderedInProgressActions);
                renderedActions = renderedActions.concat(renderedRecentlyDoneActions);
                this.allRenderedActions = renderedActions;
                this.allConnections = this.computeActionConnections();
            }
            KanbanRendering.prototype.computeActionAttributes = function (actions, borderClass, columnPosition) {
                var _this = this;
                var renderedActions = [];
                var positionRadius = Math.floor(this.columnWidth / 2);
                var tempIndex = 0;
                actions.forEach(function (action) {
                    action.urgency = to.common.getUrgencyOfAction(action);
                    var color = to.chart.bubble.getNodeFill(action);
                    var radius = to.chart.bubble.getNodeRadius(action);
                    var x = columnPosition * _this.columnWidth + positionRadius;
                    var y = 25 + tempIndex * _this.columnWidth + positionRadius;
                    var renderedAction = new RenderedAction(action, borderClass, color, radius, x, y);
                    tempIndex++;
                    _this.renderedActionMap[action._id] = renderedAction;
                    renderedActions.push(renderedAction);
                });
                return renderedActions;
            };
            KanbanRendering.prototype.computeActionConnections = function () {
                var _this = this;
                var renderedConnections = [];
                // Compute connections between Ready and In Progress actions
                this.allRenderedActions.forEach(function (renderedAction) {
                    var action = renderedAction.action;
                    if (action.beforeActionIds) {
                        action.beforeActionIds.forEach(function (fromActionId) {
                            var fromAction = _this.actionMap[fromActionId];
                            // If from action is in Archive
                            if (!fromAction) {
                                return;
                            }
                            var renderedFromAction = _this.renderedActionMap[fromActionId];
                            // If from action is not rendered - is in planning
                            if (!renderedFromAction) {
                                return;
                            }
                            var existingConnection = renderedFromAction.connectionMap[action._id];
                            // Connection already exists
                            if (existingConnection) {
                                renderedAction.connectionMap[fromActionId] = existingConnection;
                                return;
                            }
                            // Create a new connection
                            var classes = _this.getConnectionClasses(renderedFromAction);
                            var renderedConnection = new RenderedConnection(classes, renderedFromAction, renderedAction);
                            renderedAction.connectionMap[fromActionId] = renderedConnection;
                            renderedFromAction.connectionMap[action._id] = renderedConnection;
                            renderedConnections.push(renderedConnection);
                        });
                    }
                    if (action.afterActionIds) {
                        action.afterActionIds.forEach(function (toActionId) {
                            var toAction = _this.actionMap[toActionId];
                            // If after action is in Archive
                            if (!toAction) {
                                return;
                            }
                            var renderedToAction = _this.renderedActionMap[toActionId];
                            // If after action is not rendered
                            if (!renderedToAction) {
                                return;
                            }
                            var existingConnection = renderedToAction.connectionMap[action._id];
                            // Connection already exists
                            if (existingConnection) {
                                renderedAction.connectionMap[toActionId] = existingConnection;
                                return;
                            }
                            // Create a new connection
                            var classes = _this.getConnectionClasses(action);
                            var renderedConnection = new RenderedConnection(classes, renderedAction, renderedToAction);
                            renderedAction.connectionMap[toActionId] = renderedConnection;
                            renderedToAction.connectionMap[action._id] = renderedConnection;
                            renderedConnections.push(renderedConnection);
                        });
                    }
                });
                return renderedConnections;
            };
            KanbanRendering.prototype.getConnectionClasses = function (fromAction) {
                // Create a new connection
                var classes = {};
                switch (parseInt(fromAction.kanbanState)) {
                    case to.common.Kanban.Ready:
                        classes['ready-action'] = true;
                        break;
                    case to.common.Kanban.InProgress:
                        classes['in-progress-action'] = true;
                        break;
                    case to.common.Kanban.RecentlyDone:
                        classes['done-action'] = true;
                        break;
                }
                return classes;
            };
            KanbanRendering.prototype.getActions = function () {
                return this.allRenderedActions;
            };
            KanbanRendering.prototype.getConnections = function () {
                return this.allConnections;
            };
            KanbanRendering.prototype.getChartHeight = function () {
                return this.maxVerticalNumActions * this.columnWidth;
            };
            KanbanRendering.prototype.getColumnWidth = function () {
                return Math.floor(Math.min(window.innerHeight, window.innerWidth) / 3);
            };
            KanbanRendering.prototype.getMaxActionRadius = function (//
                columnWidth //
                ) {
                return Math.floor(columnWidth / 3 * 2);
            };
            KanbanRendering.prototype.getOffset = function (columnWidth, radius) {
                return Math.floor(columnWidth / 2 - radius);
            };
            return KanbanRendering;
        }());
        track.KanbanRendering = KanbanRendering;
    })(track = to.track || (to.track = {}));
})(to || (to = {}));
//# sourceMappingURL=KanbanRenderEngine.js.map