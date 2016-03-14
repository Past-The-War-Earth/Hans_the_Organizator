///<reference path="../imports.ts"/>

/**
 * Created by artem on 7/3/15.
 */

module to.chart {

	class ClickableBubbleChartController extends to.track.EisenhowerBaseController implements to.track.QuadrantContainer {

		circle:any;
		actions:to.model.Action[];
		priorities;
		urgencies;
		navArray = [4, 3, 2, 1, 0];

		constructor
		(private $ionicActionSheet,
		 $ionicHistory,
		 $ionicViewService,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 private $stateParams,
		 private actionRepository:to.storage.ActionRepository,
		 categoryRepository:to.storage.CategoryRepository,
		 motivationRepository:to.storage.MotivationRepository) {
			super($ionicHistory, $scope, $state, categoryRepository, motivationRepository, 'ClickableBubbleChartController', 'Track');
			//$ionicViewService.clearHistory();
			this.reload();
		}

		reload():Promise<any> {
			return super.reload().then(()=> {
				var plannedActions = [];
				var readyActions = [];
				var inProgressActions = [];
				var urgencies = {};
				var priorities = {};
				this.actionRepository.getByParameters(this.$stateParams.urgencies, this.$stateParams.priorities, this.$stateParams.kanbanState, this.$stateParams.categoryId, this.$stateParams.motivationId).then((allActions)=> {
					allActions.forEach((action:BubbleAction)=> {
						action.urgency = to.common.getUrgencyOfAction(action);
						switch (parseInt(action.kanbanState)) {
							case this.Kanban.Planned:
								plannedActions.push(action);
								break;
							case this.Kanban.Ready:
								readyActions.push(action);
								break;
							case this.Kanban.InProgress:
								inProgressActions.push(action);
								break;
						}
					});
					this.computeQuadrantStates(allActions, this);
					var plannedNodes = bubble.getNodesOnOrbit(bubble.PLANNED_ORBIT, plannedActions, 'planned-action');
					var readyNodes = bubble.getNodesOnOrbit(bubble.READY_ORBIT, readyActions, 'ready-action');
					var inProgressNodes = bubble.getNodesOnOrbit(bubble.IN_PROGRESS_ORBIT, inProgressActions, 'in-progress-action');
					this.setupHeader(this.$stateParams.urgencies, this.$stateParams.priorities, this.$stateParams.kanbanState, this.$stateParams.categoryId, this.$stateParams.motivationId);
					this.setupChart(plannedNodes, readyNodes, inProgressNodes);
				});
			});

		}

		private setupHeader(urgencies, priorities, kanbanState:string, categoryId:string, motivationId:string) {
			if (priorities != to.common.Priority.All) {
				this.priorities = priorities.split(',');
			} else {
				this.priorities = [];
			}
			if (urgencies != to.common.Urgency.All) {
				this.urgencies = urgencies.split(',');
			} else {
				this.urgencies = [];
			}
		}

		getWindowWidth() {
			return window.innerWidth;
		}

		setupChart(plannedNodes, readyNodes, inProgressNodes) {

			var map:{
				svg?:any;
				nodes?:any;
				redraw?:()=>any;
				width:any;
				height:number;
			} = {
				width: window.innerWidth - 4,
				height: window.innerWidth - 4
			};

			map.svg =
				d3.select('svg')
					.attr('width', map.width)
					.attr('height', map.height)
					.append('g');
			//map.svg.append('rect')
			//	.attr('class', 'overlay')
			//	.attr('width', map.width)
			//	.attr('height', map.height);

			/* PREPARE DATA and SCALES */
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

			var x =
				d3.scale.linear()
					.domain([0, map.width])
					.range([0, map.width]);
			var y =
				d3.scale.linear()
					.domain([0, map.height])
					.range([map.height, 0]);


			/* PLOT */
			map.svg.draw =
				()=> {
					this.circle = map.svg.selectAll('circle')
						.data(map.nodes).enter()
						.append('circle')
						.attr('r', function (d:ActionNode) {
							return d.r;
						})
						.attr('actionId', function (d:ActionNode) {
							return d.actionId;
						})
						.attr('fill', function (d:ActionNode) {
							return d.fill;
						})
						.attr('class', function (d:ActionNode) {
							return d.class;
						})
						.attr('transform', map.svg.transform);
				};

			map.svg.draw();

			map.redraw = ()=> {
				this.circle.attr('transform', map.svg.transform);
			};

			map.svg.transform =
				function (d) {
					return 'translate(' + x(d.x) + ',' + y(d.y) + ')';
				};

			/* FORCE */
			var force =
				d3.layout.force()
					.gravity(0.046)
					.charge(function (d, i) {
						return 0;
					})
					.nodes(map.nodes)
					.size([map.width, map.height])
					.start();

			force.on('tick', function (e) {
				var q = (<any>d3).geom.quadtree(map.nodes), i;
				for (i = 1; i < map.nodes.length; ++i) {
					q.visit(bubble.collide(map.nodes[i]));
				}
				map.redraw();
			});

			var lastSelectedNode;
			jQuery('circle').click((event)=> {
				if (lastSelectedNode) {
					lastSelectedNode.removeClass('selected-action');
				}
				lastSelectedNode = jQuery(event.currentTarget);
				jQuery(event.currentTarget).addClass('selected-action');
				this.actionRepository.get((<any>event.currentTarget).getAttribute('actionId')).then((action)=> {
					this.actions = [action];
					this.$scope.$apply();
				});
			});

		}

	}

	angular.module('organizator').controller('ClickableBubbleChartController', ClickableBubbleChartController);
}
