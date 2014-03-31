// This module will implement data source configurations
// for visualization dashboards.
//
// Curran Kelleher 3/26/2014
define(['udc', 'wire'], function (UDC, wire) {

  // The constructor function.
  return function () {
    var model = new Backbone.Model({ sources: [] });
    model.udc = UDC();
    model.wire(['sources'], function (sources) {
      sources.forEach(function (source) {
        model.udc.load(source, function () {
          console.log('loaded ' + source);
        });
      });
    });
    return model;
  }
});
