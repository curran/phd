// This module provides a mirror of the dashboard
// model that updates state based on processing 
// configuration change actions.
//
// Curran Kelleher 3/30/2014
define([], function () {
  return function DashboardMirror(){

    // Keeps track of the entire dashboard model
    // as a simple JavaScript object.
    //
    // * Keys are component aliases
    // * Values are component option objects
    components = {};

    return {
      // Gets a component options object for the given alias.
      get: function (alias) {

        // Protect from outside mutation by cloning
        return _.clone(components[alias]);
      },
      update: function (change){
        //change.deletedComponents.forEach(function (alias) {
        //  // TODO test this codepath
        //  delete existingComponents[alias];
        //});
        change.createdComponents.forEach(function (component) {
          components[component.alias] = { module: component.module };
        });
        change.updatedComponents.forEach(function (component) {
          _.extend(components[component.alias], component.options);
        });
      }
    }
  };
});
