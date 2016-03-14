///<reference path="../imports.ts"/>

/**
 * Created by artem on 7/3/15.
 */

module to.chart {

  class BubbleChartController extends to.common.LeafComponent {

    constructor(
      $scope:angular.IScope,
      $state:angular.ui.IStateService
    ) {
      super($scope, $state, 'BubbleChartController', 'Birds Eye');

      setTimeout(()=> {
        this.setup();
      }, 2000);
    }

    setup() {

      var map:{
        canvas?:any;
        nodes?:any;
        redraw?:()=>any;
        width:any;
        height:number;
      } = {
        width: 350,
        height: 350
      };

      let canvasNode = d3.select('canvas')
        .attr('width', map.width)
        .attr('height', map.height)
        .node();
      map.canvas = (<any>canvasNode).getContext('2d');

      /* PREPARE DATA and SCALES */

      map.canvas.nodes =
        d3.range(100).map(function (
          d,
          i
        ) {
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

      var x =
        d3.scale.linear()
          .domain([0, map.width])
          .range([0, map.width]);

      var y =
        d3.scale.linear()
          .domain([0, map.height])
          .range([map.height, 0]);


      /* PLOT */
/* FIXME: convert to ClickableBubbleChartController style
      map.canvas.draw =
        function () {
          map.canvas.clearRect(0, 0, map.width, map.height);
          map.canvas.beginPath();
          var i = -1, cx, cy;
          while (++i < map.canvas.nodes.length) {
            d = map.canvas.nodes[i];
            cx = x(d.x);
            cy = y(d.y);
            map.canvas.moveTo(cx, cy);
            map.canvas.arc(cx, cy, d.r, 0, 2 * Math.PI);
          }
          map.canvas.fill();
        };
*/

      map.canvas.draw();

      map.redraw = function () {
        map.canvas.draw();
      };


      /* FORCE */

      var force =
        d3.layout.force()
          .gravity(0.15)
          .charge(function (
            d,
            i
          ) {
            return i ? 0 : -2000;
          })
          .nodes(map.nodes)
          .size([map.width, map.height])
          .start();
/*
FIXME: convert to ClickableBubbleChartController style
      force.on('tick', function ( e ) {
        var q = d3.geom.quadtree(map.nodes), i;
        for (i = 1; i < map.nodes.length; ++i) {
          q.visit(collide(map.nodes[i]));
        }
        map.redraw();
      });
*/

      function collide( node ) {
        var r = node.r + 6,
          nx1 = node.x - r,
          nx2 = node.x + r,
          ny1 = node.y - r,
          ny2 = node.y + r;
        return function (
          quad,
          x1,
          y1,
          x2,
          y2
        ) {
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


      /* LISTENERS */

      function mousemove() {
        var p = d3.mouse(this);
        root.px = x.invert(p[0]);
        root.py = y.invert(p[1]);
        force.resume();
      }

      d3.select('body')
        .on('mousemove', mousemove)
        .call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 8]).on('zoom', map.redraw));
    }
  }

  angular.module('organizator').controller('BubbleChartController', BubbleChartController);
}
