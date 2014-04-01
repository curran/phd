// This module implements data source configurations
// for visualization dashboards.
//
// Curran Kelleher 3/26/2014
define(['udc'], function (UDC) {
  return function () {
    // TODO add docs for `sources`
    var model = new Backbone.Model();
    model.udc = UDC();
    model.wire('sources', function (sources) {
      sources.forEach(model.udc.load);
    });
    return model;
  }
});
