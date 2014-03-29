// This module implements links in a data flow network
// supporting multiple linked views in a visualization dashboard.
//
// Curran Kelleher 3/28/2014
define(['wire'], function (wire) {

  // The constructor function.
  return function (dashboard) {
    var model = new Backbone.Model({
      bindings: []
    });

    wire(['bindings'], function (bindings) {
      bindings.forEach(function (binding) {
        var source = parse(binding.source),
            destination = parse(binding.destination);
        dashboard.getComponent(destination.alias, function (destinationModel) {
          dashboard.getComponent(source.alias, function (sourceModel) {
            wire([source.property], function (value) {
              destinationModel.set(destination.property, value);
            }, sourceModel);
          });
        });
      });
    }, model);

    function parse(bindingStr){
      var arr = bindingStr.split('.');
      return {
        alias: arr[0],
        property: arr[1]
      };
    }

    return model;
  }
});
