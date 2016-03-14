///<reference path="../imports.ts"/>
/**
 * Created by artem on 7/3/15.
 */
//declare var d3;
var to;
(function (to) {
    var chart;
    (function (chart) {
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        var bubble;
        (function (bubble) {
            bubble.PI = 3.1415926;
            bubble.PLANNED_ORBIT = 55000;
            bubble.READY_ORBIT = 5000;
            bubble.IN_PROGRESS_ORBIT = 50;
            function getNodesOnOrbit(radius, actions, borderClass) {
                var nodes = [];
                var numPoints = actions.length;
                for (var i = 0; i < numPoints; i++) {
                    var action = actions[i];
                    var node = {
                        actionId: action._id,
                        class: borderClass,
                        fill: '#' + getNodeFill(action),
                        r: getNodeRadius(action),
                        x: radius * Math.cos((i * 2 * bubble.PI) / numPoints),
                        y: radius * Math.sin((i * 2 * bubble.PI) / numPoints)
                    };
                    nodes.push(node);
                }
                return nodes;
            }
            bubble.getNodesOnOrbit = getNodesOnOrbit;
            function getNodeFill(action) {
                return to.common.selectedMatrixColors[action.urgency][4 - parseInt(action.priority)];
            }
            bubble.getNodeFill = getNodeFill;
            function getNodeRadius(action) {
                return (7 + parseInt(action.priority) * 2) * 2;
            }
            bubble.getNodeRadius = getNodeRadius;
            function collide(node) {
                var r = node.r + 6, nx1 = node.x - r, nx2 = node.x + r, ny1 = node.y - r, ny2 = node.y + r;
                return function (quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== node)) {
                        var x = node.x - quad.point.x, y = node.y - quad.point.y, l = Math.sqrt(x * x + y * y), r = node.r + quad.point.r;
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
            bubble.collide = collide;
        })(bubble = chart.bubble || (chart.bubble = {}));
    })(chart = to.chart || (to.chart = {}));
})(to || (to = {}));
//# sourceMappingURL=ChartCommons.js.map