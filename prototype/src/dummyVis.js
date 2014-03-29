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
          text: ''
        }),
        svg = dashboard.div.append('svg')
          .style('position', 'absolute'),
        rect = svg.append('rect')
          .attr('x', 0)
          .attr('y', 0),
        text = svg.append('text');

    wire(['color'], function (color) {
      rect.attr('fill', color);
    }, model);

    wire(['text'], function (newText) {
      text.text(newText);
    }, model);

    wire(['box'], function (box) {
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
    }, model);

    return model;
  }
});
