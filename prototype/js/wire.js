/**
 * A function for wiring up properties on Backbone models
 * to functions that depend on them.
 *
 * Inspired by Ember's computed properties
 * and Angular's dependency injection.
 *
 * See also https://github.com/curran/backboneComputedProperties
 *
 * Example usage:
 *
 * ```
 * wire(['firstName', 'lastName'], function (first, last) {
 *   model.set('fullName', first + last);
 * }, model);
 * ```
 *
 * Curran Kelleher 3/27/2014
 */
define([], function () {
  return function wire(dependencies, fn, model){
    var callFn = _.debounce(function(){
      fn.apply(null, dependencies.map(function (property){
        return model.get(property);
      }));
    });
    callFn();
    dependencies.forEach(function(property){
      model.on('change:' + property, callFn);
    });
  }
});
