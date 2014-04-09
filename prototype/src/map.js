// A map visualization.
//
// Draws from:
//
//  * Mike Bostock's map example:
//    http://bl.ocks.org/mbostock/3757132
//  * SVG Geometric Zooming example:
//    http://bl.ocks.org/mbostock/3680999
//
// TODO visualize UN population data drawing from
// Choropleth - http://bl.ocks.org/mbostock/4060606
//
// Curran Kelleher 4/9/2014
define([], function () {

  // The constructor function invoked by `dashboardScaffold`.
  return function (dashboard) {

    // Append the svg element for this visualization
    // to the dashboard div.
    var svg = dashboard.div.append('svg')

          // Use CSS `position: absolute;`
          // so setting `left` and `top` later will
          // position the SVG relative to the dashboard div.
          .style('position', 'absolute'),

        // Use a mercator projection.
        projection = d3.geo.mercator().precision(.1),
        geoPath = d3.geo.path().projection(projection),
        g = svg.append('g')
          .call(d3.behavior.zoom().on('zoom', zoom))
          .append('g'),

        // The dummy visualization has
        // the following configuration options:
        model = new Backbone.Model({
          // `box` is a property expected to be on all
          // visualization components, and is set by
          // the dashboard layout engine.
        });

    model

      // When the size of the visualization is set
      // by the dashboard layout engine,
      .wire('box', function (box) {

        // Set the CSS `left` and `top` properties
        // to move the SVG to `(box.x, box.y)`
        // relative to the dashboard div.
        svg
          .style('left', box.x + 'px')
          .style('top', box.y + 'px')

          // Set the `width` and `height` attributes
          // to the size computed by the dashboard layout engine
          // on the SVG element 
          .attr('width', box.width)
          .attr('height', box.height);
      })

      // When the data or size changes,
      .wire(['features', 'box'], function (features, box) {

        // update the map projection based on the current box,
        projection
          .scale((box.width + 1) / 2 / Math.PI)
          .translate([box.width / 2, box.height / 2]);

        // render the map.
        var path = g.selectAll('path').data(features);
        path.enter().append('path');
        path.attr('d', geoPath);
        
        // TODO traverse the data, not the geoJSON,
        // looking up polygons for each data element.
        //path.attr('d', function (d) {
        //  console.log(d);
        //  return geoPath(d);
        //});
      });

    function zoom() {
      g.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
    }

    // TODO move this into the data configuration
    d3.json('data/natural_earth/countries.json', function(error, data) {
      var feature = topojson.feature(data, data.objects.countriesGeoJSON);
      model.set('features', feature.features);
    });

    return model
  }
});
