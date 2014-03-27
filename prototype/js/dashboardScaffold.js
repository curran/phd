/**
 * The dashboard configuration engine.
 *
 * Curran Kelleher 3/26/2014
 */
define([], function () {

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
        };

    // Sets the configuration for the dashboard.
    function setConfig(config){
     
      // TODO handle config diffs only.
      // TODO handle multiple calls to setConfig
      
      // Each key in the config object
      // corresponds to a component alias.
      _.keys(config).forEach(function (alias) {
        var options = config[alias],

            // The 'module' option is used for fetching the
            // AMD module that provides the component factory.
            module = options.module;
        
        // If no 'module' property is specified,
        // use the alias as the module name.
        if(!module) {
          module = alias;
        }

        // Use require.js to dynamically fetch the module.
        require([module], function (createComponent) {

          // Assuming the module is a factory function 
          // that takes a properties object as a first argument,
          // and the dashboard public API as a second argument,
          // create and store the runtime component.
          //
          // TODO don't pass in options here,
          // handle creation and configuration separately
          components[alias] = createComponent(options, dashboard);
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
