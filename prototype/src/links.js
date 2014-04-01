// TODO add unit tests for this module
//
// Implements links in a data flow network supporting
// multiple linked views in a visualization dashboard.
//
// Curran Kelleher 3/28/2014
define([], function () {

  // The constructor function.
  return function (dashboard) {

    // The configuration expects a single property,
    // `bindings`, which is an array of objects with:
    //
    //  * `source` A binding string that identifies
    //    the source of the one-way data binding
    //  * `destination` A binding string that identifies
    //    the destination of the one-way data binding
    //
    // A binding string is a string of the form "foo.bar"
    // where "foo" is the alias of the dashboard component,
    // and "bar" is a model property name on that component.
    // 
    // For each binding entry in `bindings`, a one-way data binding
    // is established between the source and destination properties.
    //
    // Establishing a one-way data binding means that
    //
    //  * the destination property value is initialized to be
    //    the value of the source property, and
    //  * the destination property values is updated to be
    //    the value of the source property
    //    whenever the source property changes.
    var model = new Backbone.Model();

    model.wire(['bindings'], function (bindings) {
      bindings.forEach(function (binding) {
        var source = parse(binding.source),
            destination = parse(binding.destination);
        dashboard.getComponent(destination.alias, function (destinationModel) {
          dashboard.getComponent(source.alias, function (sourceModel) {
            sourceModel.wire([source.property], function (value) {
              destinationModel.set(destination.property, value);
            });
          });
        });
      });
    });

    // Parses a binding string.
    function parse(bindingStr){
      var arr = bindingStr.split('.');
      return { alias: arr[0], property: arr[1] };
    }

    return model;
  }
});
