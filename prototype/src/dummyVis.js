// This module implements a dummy visualization
// for testing the visualization dashboard framework.
//
// Curran Kelleher 3/26/2014
define(['wire'], function (wire) {

  // The constructor function.
  return function (dashboard) {
    var model = new Backbone.Model({
          color: 'white',
          box: { x: 0, y: 0, width: 0, height: 0 },
          text: '',
          lineWidth: 8
        }),
        svg = dashboard.div.append('svg')
          .style('position', 'absolute'),
        rect = svg.append('rect')
          .attr('x', 0)
          .attr('y', 0),
        text = svg.append('text'),
        lineDrag = (function () {
          var x1, x2;
          return d3.behavior.drag()
            .on('dragstart', function (d) {
              x1 = d3.event.sourceEvent.pageX;
            })
            .on('drag', function (d) {
              var x2 = d3.event.sourceEvent.pageX,
                  newLineWidth = model.get('lineWidth') + x2 - x1;
              newLineWidth = newLineWidth < 1 ? 1 : newLineWidth;
              model.set('lineWidth', newLineWidth);
              x1 = x2;
            });
        }());

    model.wire(['color'], function (color) {
      rect.attr('fill', color);
    });

    model.wire(['text'], function (newText) {
      text.text(newText);
    });

    model.wire(['box'], function (box) {
      svg
        .style('left', box.x + 'px')
        .style('top', box.y + 'px')
        .attr('width', box.width)
        .attr('height', box.height);
      rect
        .attr('width', box.width)
        .attr('height', box.height);
      text
        .attr('x', box.width / 2)
        .attr('y', box.height / 2);
    });

    model.wire(['box', 'lineWidth'], function (box, lineWidth) {
      var w = box.width,
          h = box.height,
          lines = svg.selectAll('line').data([
            {x1: 0, y1: 0, x2: w, y2: h},
            {x1: 0, y1: h, x2: w, y2: 0}
          ]);
      lines.enter().append('line');

      lines
        .attr('x1', function (d) { return d.x1; })
        .attr('y1', function (d) { return d.y1; })
        .attr('x2', function (d) { return d.x2; })
        .attr('y2', function (d) { return d.y2; })
        .style('stroke-width', lineWidth)
        .style('stroke-opacity', 0.2)
        .style('stroke', 'black')
        .call(lineDrag);

    });

    return model;
  }
});
