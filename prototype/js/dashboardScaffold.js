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
    var components = {};

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
          // that takes a properties object as an argument,
          // create the runtime component.
          components[alias] = createComponent(options);
        });
      });
    }

    // Public API
    return {
      setConfig: setConfig
    };
  }
});
