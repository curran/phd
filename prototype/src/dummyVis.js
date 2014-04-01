// This module implements a dummy visualization
// for testing the visualization dashboard framework.
//
// Curran Kelleher 3/26/2014
define(['wire'], function (wire) {

  // The constructor function.
  return function (dashboard) {
    // The dummy visualization has the following configurable options:
    var model = new Backbone.Model({

          // * `color` a background color
          color: 'white',

          // * `text` a string that gets displayed
          text: '',

          // * `lineWidth` the width of lines for the X
          lineWidth: 8

          // `box` is a property expected to be on all
          // visualization components, and is set by
          // the dashboard layout engine.
        }),

        // Append the svg element for this visualization
        // to the dashboard div.
        svg = dashboard.div.append('svg')

          // Use CSS `position: absolute;`
          // so setting `left` and `top` later will
          // position the SVG relative to the dashboard div.
          .style('position', 'absolute'),

        // Add a rect to the SVG,
        // which will be filled with the background color.
        rect = svg.append('rect')

          // The location of the rect will be fixed at (0, 0)
          // with respect to the SVG element.
          .attr('x', 0)
          .attr('y', 0),

        // Add a text element to the SVG,
        // which will render the `text` model property.
        text = svg.append('text'),

        // Make the X lines draggable such that
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

              // dragging updates the `lineWidth` model property,
              // which is visible to other visualizations in the dashboard.
              model.set('lineWidth', newLineWidth);
              x1 = x2;
            });
        }());

    // Update the color and text based on the model.
    model.wire(['color'], _.partial(rect.attr, 'fill'), rect);
    model.wire(['text'], text.text, text);

    // When the size of the visualization is set
    // by the dashboard layout engine,
    model.wire(['box'], function (box) {
      // Set the CSS `left` and `top` properties
      // to move the SVG to `(box.x, box.y)`
      // relative to the dashboard div.
      svg
        .style('left', box.x + 'px')
        .style('top', box.y + 'px')

        // Set the `width` and `height` attributes
        // of the SVG element
        .attr('width', box.width)
        .attr('height', box.height);
      // and of the background rect.
      rect
        .attr('width', box.width)
        .attr('height', box.height);

      // Update the text label to be centered.
      text
        .attr('x', box.width / 2)
        .attr('y', box.height / 2);
    });

    // Update the X lines whenever either
    // the `box` or `lineWidth` model properties change.
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

    // Return the Backbone model representing the
    // configuration of the visualizations.
    //
    // Properties on this model will be set
    // by the `dashboardScaffold` module
    // based on configuration options.
    //
    // This model will also be available to other
    // components on the dashboard, like the `links`
    // module or other visualization.
    return model;
  }
});
