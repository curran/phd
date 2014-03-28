// This module implements a dummy visualization
// for testing the visualization dashboard framework.
//
// Curran Kelleher 3/26/2014
define(['wire'], function (wire) {

  // The constructor function.
  return function (dashboard) {
    var model = new Backbone.Model({
          bkgColor: 'white',
          box: { x: 0, y: 0, width: 10, height: 10 }
        }),
        svg = dashboard.div.append('svg')
          .style('position', 'absolute'),
        rect = svg.append('rect')
          .attr('x', 0)
          .attr('y', 0);

    wire(['bkgColor'], function (bkgColor) {
      rect.attr('fill', bkgColor);
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
    }, model);

    return model;
  }
});
