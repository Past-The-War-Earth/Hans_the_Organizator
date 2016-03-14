var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var chart;
    (function (chart) {
        var ClickableBubbleChartController = (function (_super) {
            __extends(ClickableBubbleChartController, _super);
            function ClickableBubbleChartController($ionicActionSheet, $ionicHistory, $ionicViewService, $scope, $state, $stateParams, actionRepository, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'ClickableBubbleChartController', 'Track');
                this.$ionicActionSheet = $ionicActionSheet;
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.navArray = [4, 3, 2, 1, 0];
                this.reload();
            }
            ClickableBubbleChartController.prototype.reload = function () {
                var _this = this;
                return _super.prototype.reload.call(this).then(function () {
                    var plannedActions = [];
                    var readyActions = [];
                    var inProgressActions = [];
                    var urgencies = {};
                    var priorities = {};
                    _this.actionRepository.getByParameters(_this.$stateParams.urgencies, _this.$stateParams.priorities, _this.$stateParams.kanbanState, _this.$stateParams.categoryId, _this.$stateParams.motivationId).then(function (allActions) {
                        allActions.forEach(function (action) {
                            action.urgency = to.common.getUrgencyOfAction(action);
                            switch (parseInt(action.kanbanState)) {
                                case _this.Kanban.Planned:
                                    plannedActions.push(action);
                                    break;
                                case _this.Kanban.Ready:
                                    readyActions.push(action);
                                    break;
                                case _this.Kanban.InProgress:
                                    inProgressActions.push(action);
                                    break;
                            }
                        });
                        _this.computeQuadrantStates(allActions, _this);
                        var plannedNodes = chart.bubble.getNodesOnOrbit(chart.bubble.PLANNED_ORBIT, plannedActions, 'planned-action');
                        var readyNodes = chart.bubble.getNodesOnOrbit(chart.bubble.READY_ORBIT, readyActions, 'ready-action');
                        var inProgressNodes = chart.bubble.getNodesOnOrbit(chart.bubble.IN_PROGRESS_ORBIT, inProgressActions, 'in-progress-action');
                        _this.setupHeader(_this.$stateParams.urgencies, _this.$stateParams.priorities, _this.$stateParams.kanbanState, _this.$stateParams.categoryId, _this.$stateParams.motivationId);
                        _this.setupChart(plannedNodes, readyNodes, inProgressNodes);
                    });
                });
            };
            ClickableBubbleChartController.prototype.setupHeader = function (urgencies, priorities, kanbanState, categoryId, motivationId) {
                if (priorities != to.common.Priority.All) {
                    this.priorities = priorities.split(',');
                }
                else {
                    this.priorities = [];
                }
                if (urgencies != to.common.Urgency.All) {
                    this.urgencies = urgencies.split(',');
                }
                else {
                    this.urgencies = [];
                }
            };
            ClickableBubbleChartController.prototype.getWindowWidth = function () {
                return window.innerWidth;
            };
            ClickableBubbleChartController.prototype.setupChart = function (plannedNodes, readyNodes, inProgressNodes) {
                var _this = this;
                var map = {
                    width: window.innerWidth - 4,
                    height: window.innerWidth - 4
                };
                map.svg =
                    d3.select('svg')
                        .attr('width', map.width)
                        .attr('height', map.height)
                        .append('g');
                map.svg.inProgressNodes =
                    d3.range(inProgressNodes.length).map(function (d, i) {
                        return inProgressNodes[i];
                    });
                map.svg.readyNodes =
                    d3.range(readyNodes.length).map(function (d, i) {
                        return readyNodes[i];
                    });
                map.svg.plannedNodes =
                    d3.range(plannedNodes.length).map(function (d, i) {
                        return plannedNodes[i];
                    });
                map.nodes = map.svg.inProgressNodes.concat(map.svg.readyNodes).concat(map.svg.plannedNodes);
                var x = d3.scale.linear()
                    .domain([0, map.width])
                    .range([0, map.width]);
                var y = d3.scale.linear()
                    .domain([0, map.height])
                    .range([map.height, 0]);
                map.svg.draw =
                    function () {
                        _this.circle = map.svg.selectAll('circle')
                            .data(map.nodes).enter()
                            .append('circle')
                            .attr('r', function (d) {
                            return d.r;
                        })
                            .attr('actionId', function (d) {
                            return d.actionId;
                        })
                            .attr('fill', function (d) {
                            return d.fill;
                        })
                            .attr('class', function (d) {
                            return d.class;
                        })
                            .attr('transform', map.svg.transform);
                    };
                map.svg.draw();
                map.redraw = function () {
                    _this.circle.attr('transform', map.svg.transform);
                };
                map.svg.transform =
                    function (d) {
                        return 'translate(' + x(d.x) + ',' + y(d.y) + ')';
                    };
                var force = d3.layout.force()
                    .gravity(0.046)
                    .charge(function (d, i) {
                    return 0;
                })
                    .nodes(map.nodes)
                    .size([map.width, map.height])
                    .start();
                force.on('tick', function (e) {
                    var q = d3.geom.quadtree(map.nodes), i;
                    for (i = 1; i < map.nodes.length; ++i) {
                        q.visit(chart.bubble.collide(map.nodes[i]));
                    }
                    map.redraw();
                });
                var lastSelectedNode;
                jQuery('circle').click(function (event) {
                    if (lastSelectedNode) {
                        lastSelectedNode.removeClass('selected-action');
                    }
                    lastSelectedNode = jQuery(event.currentTarget);
                    jQuery(event.currentTarget).addClass('selected-action');
                    _this.actionRepository.get(event.currentTarget.getAttribute('actionId')).then(function (action) {
                        _this.actions = [action];
                        _this.$scope.$apply();
                    });
                });
            };
            return ClickableBubbleChartController;
        })(to.track.EisenhowerBaseController);
        angular.module('organizator').controller('ClickableBubbleChartController', ClickableBubbleChartController);
    })(chart = to.chart || (to.chart = {}));
})(to || (to = {}));
//# sourceMappingURL=ClickableBubbleChartController.js.map