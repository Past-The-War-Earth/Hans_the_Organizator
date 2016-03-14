///<reference path="../imports.ts"/>

/**
 * Created by artem on 7/3/15.
 */

//declare var d3;

module to.chart {

	export interface ActionNode {
		x:number;
		y:number;
		r:number;
		actionId:number;
		fill:string;
		class:string;
	}


	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	export interface BubbleAction extends to.model.Action {
		urgency:number;
	}

	export module bubble {


		export var PI = 3.1415926;
		export var PLANNED_ORBIT = 55000;
		export var READY_ORBIT = 5000;
		export var IN_PROGRESS_ORBIT = 50;

		export function getNodesOnOrbit(radius, actions:BubbleAction[], borderClass:string):ActionNode[] {
			var nodes = [];
			var numPoints = actions.length;
			for (var i = 0; i < numPoints; i++) {
				var action = actions[i];
				var node = {
					actionId: action._id,
					class: borderClass,
					fill: '#' + getNodeFill(action),
					r: getNodeRadius(action),
					x: radius * Math.cos((i * 2 * PI) / numPoints),
					y: radius * Math.sin((i * 2 * PI) / numPoints)
				};
				nodes.push(node);
			}
			return nodes;
		}

		export function getNodeFill(action:BubbleAction):string {
			return to.common.selectedMatrixColors[action.urgency][4 - parseInt(action.priority)];
		}

		export function getNodeRadius(action:BubbleAction) {
			return (7 + parseInt(action.priority) * 2) * 2;
		}

		export function collide(node) {
			var r = node.r + 6,
				nx1 = node.x - r,
				nx2 = node.x + r,
				ny1 = node.y - r,
				ny2 = node.y + r;
			return function (quad, x1, y1, x2, y2) {
				if (quad.point && (quad.point !== node)) {
					var x = node.x - quad.point.x,
						y = node.y - quad.point.y,
						l = Math.sqrt(x * x + y * y),
						r = node.r + quad.point.r;
					if (l < r) {
						l = (l - r) / l * 0.5;
						node.x -= x *= l;
						node.y -= y *= l;
						quad.point.x += x;
						quad.point.y += y;
					}
				}
				return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
			};
		}

	}
}
