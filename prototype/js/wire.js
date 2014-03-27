/**
 * A function for wiring up properties on Backbone models
 * to functions that depend on them.
 *
 * Inspired by Ember's computed properties
 * and Angular's dependency injection.
 *
 * See also https://github.com/curran/backboneComputedProperties
 *
 * Curran Kelleher 3/26/2014
 */
define([], function () {
  return function wire(dependencies, fn, model){
    var callFn = _.debounce(function(){
      var args = dependencies.map(function (property){
        return model.get(property);
      });
      fn.apply(null, args);
    });
    // TODO consider using 'change:a change:b'
    dependencies.forEach(function(property){
      model.on('change:' + property, callFn);
    });
    callFn();
  }
});
