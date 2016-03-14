var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var chart;
    (function (chart) {
        var BubbleChartController = (function (_super) {
            __extends(BubbleChartController, _super);
            function BubbleChartController($scope, $state) {
                var _this = this;
                _super.call(this, $scope, $state, 'BubbleChartController', 'Birds Eye');
                setTimeout(function () {
                    _this.setup();
                }, 2000);
            }
            BubbleChartController.prototype.setup = function () {
                var map = {
                    width: 350,
                    height: 350
                };
                var canvasNode = d3.select('canvas')
                    .attr('width', map.width)
                    .attr('height', map.height)
                    .node();
                map.canvas = canvasNode.getContext('2d');
                map.canvas.nodes =
                    d3.range(100).map(function (d, i) {
                        return {
                            x: Math.random() * map.width / 2,
                            y: Math.random() * map.height / 2,
                            r: Math.random() * 20 + 3
                        };
                    });
                map.nodes = map.canvas.nodes;
                var root = map.nodes[0];
                root.r = 0;
                root.fixed = true;
                var x = d3.scale.linear()
                    .domain([0, map.width])
                    .range([0, map.width]);
                var y = d3.scale.linear()
                    .domain([0, map.height])
                    .range([map.height, 0]);
                map.canvas.draw();
                map.redraw = function () {
                    map.canvas.draw();
                };
                var force = d3.layout.force()
                    .gravity(0.15)
                    .charge(function (d, i) {
                    return i ? 0 : -2000;
                })
                    .nodes(map.nodes)
                    .size([map.width, map.height])
                    .start();
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
                function mousemove() {
                    var p = d3.mouse(this);
                    root.px = x.invert(p[0]);
                    root.py = y.invert(p[1]);
                    force.resume();
                }
                d3.select('body')
                    .on('mousemove', mousemove)
                    .call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 8]).on('zoom', map.redraw));
            };
            return BubbleChartController;
        })(to.common.LeafComponent);
        angular.module('organizator').controller('BubbleChartController', BubbleChartController);
    })(chart = to.chart || (to.chart = {}));
})(to || (to = {}));
//# sourceMappingURL=BubbleChartController.js.map