// Curran Kelleher 3/30/2014
define(['wire'], function (wire) {

  return function (dashboard) {
    var model = new Backbone.Model({
          data: { },
          x: null,
          y: null,
          queryResult: null
        }),
        margin = {top: 20, right: 20, bottom: 30, left: 70 },
        svg = dashboard.div.append('svg')
          .style('position', 'absolute'),
        g = svg.append('g'),
        path = g.append('path')
          .style('stroke', 'black')
          .style('stroke-width', 2)
          .style('fill', 'none'),
        x = d3.time.scale(),
        y = d3.scale.linear(),
        xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom')
          .outerTickSize(0),
        yAxis = d3.svg.axis()
          .scale(y)
          .orient('left')
          .outerTickSize(0),
        xAxisGroup = g.append('g'),
        yAxisGroup = g.append('g'),
        line = d3.svg.line()
          .x(function (d) { return x(d.x); })
          .y(function (d) { return y(d.y); });

    model.wire(['box'], function (box) {
      // TODO move null checking into wire
      if(box){
        svg
          .style('left', box.x + 'px')
          .style('top', box.y + 'px')
          .attr('width', box.width)
          .attr('height', box.height);
        g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      }
    });
    model.wire(['data', 'box'], function (data, box) {
      // TODO move null checking into wire
      if(data && box){
        var width = box.width - margin.left - margin.right,
            height = box.height - margin.top - margin.bottom;
        query(data, function (xDomain, xyPoints) {
          x.domain(d3.extent(xDomain));
          y.domain([0, d3.max(xyPoints, function (d) { return d.y; })]);
          x.range([0, width]);
          y.range([height, 0]);

          path.attr('d', line(xyPoints));

          xAxisGroup.attr('transform', 'translate(0,' + height + ')');
          xAxisGroup.call(xAxis).call(styleAxis);
          yAxisGroup.call(yAxis).call(styleAxis);
        });
      }
    });
    function styleAxis(axisGroup) {
      axisGroup.selectAll('line, path')
        .style('stroke', 'black')
        .style('stroke-width', 1);
      axisGroup.style('font', '10pt sans-serif');
    }
    function query(data, callback){
      dashboard.getComponent('data', function (dataComponent) {
        var udc = dataComponent.udc;
        udc.waitFor(data.source, data.dataSet, function () {
          var xDomainStrings = udc.getDomain(data.source, data.dataSet, data.x),
              // TODO generalize handling of X dimensions, special case Time
              xDomainDates = xDomainStrings.map( function (yearStr) {
                return new Date(yearStr, 0);
              }),
              cell = _.clone(data.slices),
              xyPoints = xDomainDates.map(function (xDate, i) {
                cell[data.x] = xDomainStrings[i];
                return {
                  x: xDate,
                  y: udc.getValue(data.source, data.dataSet, cell, data.y)
                };
              });
          callback(xDomainDates, xyPoints);
        });
      });
    }

    return model;
  }
});
