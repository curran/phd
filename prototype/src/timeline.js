// Curran Kelleher 3/30/2014
define(['wire'], function (wire) {

  return function (dashboard) {
    var model = new Backbone.Model(),
        margin = {top: 20, right: 20, bottom: 30, left: 40 },
        svg = dashboard.div.append('svg').style('position', 'absolute'),
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
          .tickFormat(function (d) { return d / 1000000000; })
          .outerTickSize(0),
        xAxisGroup = g.append('g'),
        yAxisGroup = g.append('g'),
        yAxisLabel = yAxisGroup.append('text')
          .style('text-anchor', 'middle')
          .style('font', '14pt serif')
           // TODO generate this text from the data
          .text('World Population (billions)'),
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
        yAxisLabel.attr('transform', 'rotate(-90) translate(-' + (height() / 2) + ', -25)')
        xAxisGroup.attr('transform', 'translate(0,' + height() + ')');
      }
    });
    model.wire(['data', 'box'], function (data, box) {
      // TODO move null checking into wire
      if(data && box){
        query(data, function (xDomain, xyPoints) {
          x.domain(d3.extent(xDomain)); y.domain([0, d3.max(xyPoints, function (d) { return d.y; })]);
          x.range([0, width()]);
          y.range([height(), 0]);

          path.attr('d', line(xyPoints));

          xAxisGroup.call(xAxis).call(styleAxis);
          yAxisGroup.call(yAxis).call(styleAxis);
        });
      }
    });
    function width(){
      return model.get('box').width - margin.left - margin.right;
    }
    function height(){
      return model.get('box').height - margin.top - margin.bottom;
    }
    function styleAxis(axisGroup) {
      axisGroup.selectAll('line, path')
        .style('stroke', 'black')
        .style('stroke-width', 1);
      axisGroup.selectAll('g')
        .style('font', '10pt sans-serif');
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
