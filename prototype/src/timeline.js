// A generalized timeline visualization.
//
// Draws from
//
//  * [D3 Line Chart Example](http://bl.ocks.org/mbostock/3883245)
//  * [Population timeline](https://github.com/curran/visualizations/tree/gh-pages/population-simple)
//  * [D3 Margin Convention](http://bl.ocks.org/mbostock/3019563)
//
// Curran Kelleher 3/30/2014
define([], function () {

  // The constructor function invoked by `dashboardScaffold`.
  return function (dashboard) {

    // The timeline visualization has
    // the following configuration options:
    var model = new Backbone.Model({
     
          // * `margin` A margin object according to the D3 convention
          margin: { top: 20, right: 20, bottom: 30, left: 40 },

          // * `yAxisLabel` (optional) A string that will be
          //   displayed vertically next to the Y axis.
          //
          // The following properties are used internally
          // and are not part of the configuration set by users:
          //
          // * `box` is a property expected to be on all
          //   visualization components, and is set by
          //   the dashboard layout engine.

          // * `width` and `height` properties are used
          //   internally, computed from `box` and `margin`

        }),

        // Append the svg element for this visualization
        // to the dashboard div.
        svg = dashboard.div.append('svg').style('position', 'absolute'),

        // Append an SVG group element for containing the visualization.
        g = svg.append('g'),

        // Append an SVG path element that will draw the line from data.
        path = g.append('path')
          .style('stroke', 'black')
          .style('stroke-width', 2)
          .style('fill', 'none'),

        // Create scale and axis objects.
        x = d3.time.scale(),
        y = d3.scale.linear(),
        xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom')
          .outerTickSize(0),
        yAxis = d3.svg.axis()
          .scale(y)
          .orient('left')
          .tickFormat(function (d) { return d / 1000000000; })
          .outerTickSize(0),

        // `(x,y)PixelsPerTick` is used for dynamically computing
        // the number of tick marks needed based on the visualization size.
        xPixelsPerTick = 70,
        yPixelsPerTick = 30,

        // Axes are created inside their own group elements
        // so that dynamic CSS can be used rather than static CSS.
        // This is so no external CSS file is needed, and
        // the visualization is entirely defined within this source file.
        xAxisGroup = g.append('g'),
        yAxisGroup = g.append('g'),

        // Append an SVG text element for the Y axis label.
        yAxisLabel = yAxisGroup.append('text')
          .style('text-anchor', 'middle')
          .style('font', '14pt serif'),

        // Create a line object that will set the line path from data.
        line = d3.svg.line()
          .x(function (d) { return x(d.x); })
          .y(function (d) { return y(d.y); });

    // Set the Y axis label text from the model.
    model.wire('yAxisLabel', yAxisLabel.text, yAxisLabel);

    // Whenever the `box` or `margin` model properties change...
    model.wire(['box', 'margin'], function (box, margin) {

      // Add (width, height) computed properties from `box` and `margin`.
      model.set('width', box.width - margin.left - margin.right);
      model.set('height', box.height - margin.top - margin.bottom);

      // Set the CSS `left` and `top` properties
      // to move the SVG element to `(box.x, box.y)`
      // relative to the dashboard div.
      svg
        .style('left', box.x + 'px')
        .style('top', box.y + 'px')

        // Set the `width` and `height` attributes
        // to the size computed by the dashboard layout engine
        // on the SVG element 
        .attr('width', box.width)
        .attr('height', box.height);

      // Translate the SVG group element containing the visualization
      // based on the margin.
      g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    });

    // When `height` changes,
    model.wire('height', function (height) {

      // Vertically center the Y axis label, and
      yAxisLabel.attr('transform',
        'rotate(-90) translate(-' + (height / 2) + ', -25)')

      // move the X axis to the bottom.
      xAxisGroup.attr('transform', 'translate(0,' + height + ')');
    });

    // When the `data` configuration or size changes,
    model.wire(['data', 'width', 'height'], function (dataOptions, width, height) {

      // query the source data cube to extract
      // data in a form suitable for use with D3,
      query(dataOptions, function (data) {

        // update scales based on data and size,
        x.domain(d3.extent(data, function (d) { return d.x }));
        x.range([0, width]);
        y.domain([0, d3.max(data, function (d) { return d.y; })]);
        y.range([height, 0]);

        // Set the number of tick marks so that tick density
        // is consistent after resizing the visualization.
        xAxis.ticks(width / xPixelsPerTick);
        yAxis.ticks(height / yPixelsPerTick);

        // compute the line path from data,
        path.attr('d', line(data));

        // and update the axes.
        xAxisGroup.call(xAxis).call(styleAxis);
        yAxisGroup.call(yAxis).call(styleAxis);
      });
    });

    // Styles a D3 axis using dynamic CSS.
    function styleAxis(axisGroup) {

      // Set the line to be black and 1 pixel wide.
      axisGroup.selectAll('line, path')
        .style('stroke', 'black')
        .style('stroke-width', 1);

      // Set the font on tick mark labels.
      axisGroup.selectAll('g')
        .style('font', '10pt sans-serif');
    }

    // Queries the source data cube to extract
    // data in a form suitable for use with D3.
    //
    // `data` A data configuration object with
    //  * `source` The name of the data source
    //  * `dataSet` The name of the data set
    //  * `slices` An object that defines the
    //    fixed slice for dimensions that do not
    //    vary within visualization
    //    * Keys are dimension names
    //    * Values are member codes
    /* TODO use (codeList, code) pairs for identifying members here */
    //  * `x` The name of the dimension to use for the X axis
    /* TODO use a dimension selection for x */
    //  * `y` The name of the measure to use for the Y axis
    //
    // `callback(data)` A callback function called with
    //  * `data` An array of objects with
    //    * `x` The member values for the X axis
    //    * `y` The numeric values for the Y axis
    function query(dataOptions, callback){

      // Get the `data` component from the dashboard configuration,
      // which is responsible for loading data sources.
      dashboard.getComponent('data', function (dataComponent) {

        // Extract the UDC context from the `data` component.
        var udc = dataComponent.udc,
            source = dataOptions.source,
            dataSet = dataOptions.dataSet;

        // Wait for the data set to load.
        udc.waitFor(source, dataSet, function () {

          // Query the data cube for the X dimension domain.
          /* TODO refactor the API so (source, dataSet) are not needed */
          var xDomainStrings = udc.getDomain(source, dataSet, dataOptions.x),

              /* TODO generalize handling of X dimensions, special case Time */
              // Parse X dimension domain values into JS Date objects.
              xDomainDates = xDomainStrings.map( function (yearStr) {
                return new Date(yearStr, 0);
              }),
              // Use the `slice` option as the basis for the current cell.
              cell = _.clone(dataOptions.slices);

          // Call the callback with (x, y) pairs.
          callback(xDomainStrings.map(function (xValue, i) {

            // Set the X dimension value for the current cell
            // to the X domain value.
            cell[dataOptions.x] = xValue;
            
            // Map X domain objects to data element objects with
            return {

              // * `x` The date corresponding to the X domain value.
              x: xDomainDates[i],

              // * `y` The measure value from the data cube for
              // the current cell and the configured Y measure.
              y: udc.getValue(source, dataSet, cell, dataOptions.y)
            };
          }));
        });
      });
    }

    return model;
  }
});
