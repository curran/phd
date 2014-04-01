// A function for wiring up properties on Backbone models
// to functions that depend on them.
//
// One of the most common patterns when using Backbone is the following:
//
//  * make a function that depends on several things in a Backbone model
//  * call the function once for initialization
//  * add change listeners for properties in the model so the function is called when those properties change
//  * add an `if` statement in the change handler to check if all properties 
//    are not null or undefined before using them
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
//
// model.wire(['firstName', 'lastName'], function (first, last) {
//   model.set('fullName', first + last);
// });
// ```
//
// The above example code uses `wire` to implement a
// computed property, `fullName`, which will be initialized
// when wire is called, and updated whenever `firstName` or
// `lastName` changes. The values for `firstName` and `lastName`
// are passed as arguments into the callback, based on the ordering
// in the array passed as the first argument.
//
// Curran Kelleher 4/1/2014

// `model.wire(dependencies, fn[, thisArg])`
//
//  * `dependencies` An array of dependency properties.
//    These are property names in the Backbone model.
//    This can also be a single string in the case of 
//    having only one dependency property.
//
//  * `fn` The callback function that will be invoked with
//    current values for each dependency property as arguments
//    in the order specified by `dependencies`.
//    This function will be invoked:
//
//    * once immediately after calling `wire`
//
//    * every time any dependency property changes
//    
//    `fn` will not be invoked unless all dependency property 
//    values have been defined (if any property values are
//    `undefined`, `fn` will not be invoked).
//
//  * `thisArg` (optional) The object used as `this` when invoking `fn`.
//
// Note that `fn` is invoked on the next tick of the JavaScript
// event loop, both for initialization and for dependency property updates.
//
// Note also that sequential changes to multiple dependency properties
// result in only a single invocation of `fn`.
//
// `wire` is added to the prototype of `Backbone.Model`, so it can be
// invoked as `model.wire()` on any Backbone model.
Backbone.Model.prototype.wire = function (dependencies, fn, thisArg){

  // Grab a reference to `this` for use in inner closures.
  var model = this;

  // Support passing a single string as `dependencies`
  if(!(dependencies instanceof Array)) {
    dependencies = [dependencies];
  }

  // `callFn()` will invoke `fn` with values of dependency properties
  // on the next tick of the JavaScript event loop.
  var callFn = _.debounce(function(){

    // Extract the values for each dependency property from the model.
    var values = dependencies.map(model.get, model);

    // Only call the function if all values are defined.
    if(!_.some(values, _.isUndefined)){

      // Call `fn` with the dependency property values.
      fn.apply(thisArg, values);
    }
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
