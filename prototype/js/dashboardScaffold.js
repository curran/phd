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
      var actions = [];
      function create(alias) {
        actions.push({
          method: 'create',
          alias: alias
        });
      }
      function set(alias, property, value) {
        actions.push({
          method: 'set',
          alias: alias,
          property: property,
          value: value
        });
      }
     
      // TODO handle config diffs only.
      // TODO handle multiple calls to setConfig
      
      // Each key in the config object
      // corresponds to a component alias.
      _.keys(config).forEach(function (alias) {
        var options = config[alias];

        create(alias);

        _.keys(options).forEach(function (property) {
          var value = options[property];
          set(alias, property, value);
        });

      });

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
