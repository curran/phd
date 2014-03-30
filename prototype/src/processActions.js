// This module helps processes configuration change actions.
//
// Curran Kelleher 3/30/2014
define(['dashboardMirror'], function (DashboardMirror) {

  // Creates a stateful function for processing actions.
  // Usage: `var processActions = ProcessActions(); processActions(actions);`
  return function ProcessActions(){

    // Components that have been created by input actions
    // but have not yet had their `module` property set.
    //  * Keys are aliases
    //  * Values are options objects
    var createdAliases = {},
        // The stateful mirror of the dashboard model
        mirror = DashboardMirror();

    // `processActions(actions)` takes as input an array of
    // configuration change actions and yields as output a
    // `change` object with the following properties:
    //  * `deletedComponents` an array of deleted aliases
    //  * `createdComponents` an array of objects with properties:
    //    * `alias` the alias of the created component
    //    * `module` the module property of the created component
    //  * `updatedComponents` an array of objects with properties:
    //    * `alias` the alias of the updated component
    //    * `options` an options object containing the 
    //      properties that have changed and their new values
    //  * Any `create` input action (and subsequent `set` actions) 
    //    will not propagate to the output `change` object 
    //    until the `module` property has been set on the component.
    //  * Any `set` input action that changes the `module` property
    //    is transformed into a `change` object that:
    //     1. deletes the existing component
    //     2. creates a new component with the same alias as
    //     3. sets the `module` property to the new module value
    //     4. sets the properties from the existing component
    return function processActions(actions){
      var change = { createdComponents: [], updatedComponents: [], deletedComponents: [] },
          methods = {
            'create': function (alias) { createdAliases[alias] = {}; },
            'delete': function (alias) { change.deletedComponents.push(alias); },
            'set': function (alias, property, value) {
              // Error when a property is set on a component that doesn't exist.
              // A component "exists" when
              var componentExists = (
                // it has been set up completely, or
                mirror.get(alias) ||
                // its creation is pending, awaiting the module property, or
                createdAliases[alias] ||
                // it was created in the current action sequence.
                _.findWhere(change.createdComponents, { alias: alias })
              );
              if(!componentExists){
                throw new Error([ "Attempted to set property '", property," = ", value,
                  "' on a component with alias '", alias, "' that hasn't been created yet."
                ].join(''));
              }
              if(property == 'module') {
                // If the module is being set on a newly created component,
                if(createdAliases[alias]) {
                  // transfer properties set before the module property
                  getUpdatedComponent(alias).options = createdAliases[alias];
                  delete createdAliases[alias];
                // If the module property changes from one value to another,
                } else {
                  // delete the existing component, then
                  change.deletedComponents.push(alias);
                  // set values from existing component.
                  getUpdatedComponent(alias).options = mirror.get(alias);
                }
                // create or recreate the component
                change.createdComponents.push({ alias: alias, module: value });
              } else {
                // Queue property changes that are set before the module
                if(createdAliases[alias]){
                  createdAliases[alias][property] = value;
                } else {
                  getUpdatedComponent(alias).options[property] = value;
                }
              }
            }
          };
      function getUpdatedComponent(alias){
        var updatedComponent = _.findWhere(change.updatedComponents, { alias: alias });
        if(!updatedComponent) {
          updatedComponent = { alias: alias, options: {} };
          change.updatedComponents.push(updatedComponent);
        }
        return updatedComponent;
      }
      actions.forEach(function (a) { methods[a.method](a.alias, a.property, a.value); });
      mirror.update(change);
      return change;
    }
  }
});
