/**
 * The dashboard configuration engine.
 *
 * Curran Kelleher 3/26/2014
 */
define(['configDiff'], function (configDiff) {

  // Constructor function for dashboards.
  return function DashboardScaffold(dashboardDivId){

    // The runtime components within the dashboard.
    // Keys: component aliases
    // Values: Backbone models for each component
    var components = {},

        // The public API object.
        // This is returned by the dashboard constructor function,
        // and also passed into component module constructors.
        dashboard = {
          setConfig: setConfig,
          getComponent: getComponent,
          div: d3.select('#' + dashboardDivId)
        },

        // The previously set configuration object,
        // used for computing diffs between subsequent calls to setConfig().
        oldConfig = {};

    // Sets the configuration for the dashboard.
    function setConfig(newConfig){
      // TODO handle config diffs only.
      // TODO handle multiple calls to setConfig
      var actions = configDiff(oldConfig, newConfig);

      // Process actions
      var createdComponents = {},
          methods = {
            'create': function (alias) {
              createdComponents[alias] = {};
            },
            'set': function (alias, property, value) {
              // TODO if(createdComponents[alias]) {
              createdComponents[alias][property] = value;
              // } else {
              //   components[alias].set('property', value);
              // }
            }
          };
      actions.forEach(function (a) {
        methods[a.method](a.alias, a.property, a.value);
      });

      // Process newly created components
      _.keys(createdComponents).forEach(function (alias) {
        var options = createdComponents[alias];

        // Use require.js to dynamically fetch the module.
        require([options.module], function (createComponent) {

          // Assuming the module provides a factory function 
          // that takes the dashboard public API as an argument,
          // and returns a Backbone model,
          // create and store the runtime component.
          var model = createComponent(dashboard);
          components[alias] = model;

          // Pass initial configuration options into the model.
          model.set(options);
        });
      });
    }

    // Gets a runtime dashboard component by name.
    // Calls the callback with the component object.
    // If the component has not yet loaded,
    // waits for the component to load.
    function getComponent(alias, callback) {
      var component = components[alias];

      // If the component is already loaded,
      if(component){
        // call the callback immediately,
        callback(component);
      } else {
        // otherwise, wait until the component has loaded
        // by polling every 10 ms.
        setTimeout(function () {
          getComponent(alias, callback)
        }, 10);
      }
    }

    // Return the public API.
    return dashboard;
  }
});