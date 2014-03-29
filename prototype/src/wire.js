// A function for wiring up properties on Backbone models
// to functions that depend on them.
//
// One of the most common patterns when using Backbone is the following:
//
//  * make a function that depends on several things in a Backbone model
//  * call the function once for initialization
//  * add change listeners for properties in the model so the function is called when those properties change
//
// The `wire` function provides a clean API for this pattern.
//
// Inspired by
//
//  * [Ember's computed properties](http://emberjs.com/guides/object-model/computed-properties/)
//  * [Angular's dependency injection](http://docs.angularjs.org/guide/di)
//  * [Require's dependency declaration syntax](http://requirejs.org/docs/api.html#defdep)
//
// See also https://github.com/curran/backboneComputedProperties
//
// Example usage:
//
// ```
// var model = new Backbone.Model({
//   firstName: "Jane",
//   lastName: "Doe"
// });
// wire(['firstName', 'lastName'], function (first, last) {
//   model.set('fullName', first + last);
// }, model);
// ```
//
// The above example code uses `wire` to implement a
// computed property, `fullName`, which will be initialized
// when wire is called, and updated whenever `firstName` or
// `lastName` changes. The values for `firstName` and `lastName`
// are passed as arguments into the callback, based on the ordering
// in the array passed as the first argument.
//
// Curran Kelleher 3/27/2014
define([], function () {

  // `wire(dependencies, fn, model)`
  //
  // or
  //
  // `model.wire = wire; model.wire(dependencies, fn)`
  //
  //  * `dependencies` An array of dependency properties.
  //    These are property names in the Backbone model `model`
  //    passed as the last argument.
  //  * `fn` The callback function that will be invoked with
  //    current values for each dependency property as arguments
  //    in the order specified by `dependencies`. This function will be invoked:
  //    * once immediately after calling `wire`
  //    * every time any dependency property changes
  //  * `model` The Backbone Model used for evaluating
  //    dependency properties.
  //
  // Note that `fn` is invoked on the next tick of the JavaScript
  // event loop, both for initialization and for dependency property updates.
  //
  // Note also that sequential changes to multiple dependency properties
  // result in only a single invocation of `fn`.
  function wire(dependencies, fn, model){

    // Make `model.wire = wire; model.wire(demendencies, fn)` possible
    if(!model) {
      model = this;
    }

    // `callFn()` will invoke `fn` with values of dependency properties
    // on the next tick of the JavaScript event loop.
    var callFn = _.debounce(function(){
      fn.apply(null, dependencies.map(model.get, model));
    });

    // Invoke `fn` once for initialization.
    callFn();

    // Invoke `fn` when dependency properties change.
    //
    // Multiple sequential dependency property changes 
    // result in only a single invocation of `fn`
    // because callFn is [debounced](underscorejs.org/#debounce).
    dependencies.forEach(function(property){
      model.on('change:' + property, callFn);
    });
  }

  // Make `model.wire(demendencies, fn)` possible
  // for any Backbone model
  if(Backbone && Backbone.Model) {
    Backbone.Model.prototype.wire = wire;
  }

  return wire;
});
