// This module implements data source configurations
// for visualization dashboards.
//
// Curran Kelleher 3/26/2014
define(['udc', 'wire'], function (UDC, wire) {
  return function () {
    var model = new Backbone.Model();
    model.udc = UDC();
    model.wire(['sources'], function (sources) {
      // TODO move null checking into wire
      if(sources){
        sources.forEach(model.udc.load);
      }
    });
    return model;
  }
});
