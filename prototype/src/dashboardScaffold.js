// The dashboard configuration engine.
// 
// Curran Kelleher 3/26/2014
define(['configDiff', 'processActions'], function (configDiff, ProcessActions) {

  // Constructor function for dashboards.
  //  * The `dashboardDivId` argument provides the id of
  //    an existing div that the dashboard will be injected into.
  return function DashboardScaffold(dashboardDivId){

    // The runtime components within the dashboard.
    //  * Keys: component aliases
    //  * Values: Backbone models for each component
    var components = {},

        // The public API object returned by the dashboard constructor function,
        // and also passed into component module constructors.
        dashboard = {
          setConfig: setConfig,
          getComponent: getComponent,
          div: d3.select('#' + dashboardDivId)
        },

        // The previously set configuration object,
        // used for computing diffs between subsequent calls to setConfig().
        oldConfig = {},

        // The stateful function that preprocesses actions
        // for this particular dashboard.
        processActions = ProcessActions();

    // Sets the configuration for the dashboard.
    function setConfig(newConfig){

      // Convert the configuration changes into a sequence of actions 
      var changes = processActions(configDiff(oldConfig, newConfig));

      //TODO changes.deletedComponents.forEach(function (deletedComponent) {
      //  // delete deletedComponent
      //});

      changes.createdComponents.forEach(function (component) {
        // Use require.js to dynamically fetch the module.
        require([component.module], function (createModel) {

          // Assuming the module provides a factory function 
          // that takes the dashboard public API as an argument,
          // and returns a Backbone model,
          // create and store the runtime component.
          components[component.alias] = createModel(dashboard);
        });
      });

      changes.updatedComponents.forEach(function (component) {
        getComponent(component.alias, function (model) {
          model.set(component.options);
        });
      });

      oldConfig = newConfig;

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
