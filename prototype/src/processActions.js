// This module provides a stateful function that
// processes configuration change actions into a
// `change` object with the following properties:
//
//  * `deletedComponents` an array of alias Strings
//    for deleted components
//
//  * `createdComponents` an array of objects with:
//    * `alias` the alias of the created component
//    * `module` the module property of the created component
//
//  * `updatedComponents` an array of objects with:
//    * `alias` the alias of the updated component
//      (could also be a newly created component)
//    * `options` an options object containing the 
//      properties that have changed and their new values
//
//  * Any `create` input action will not propagate
//    to the output `changes` object until its `module`
//    property has been set.
//
//    This is so runtime components can be instantiated 
//    before any options are set on them.
//
//  * Any `set` input action that changes the `module` property
//    on any component is transformed into a `change` object that:
//
//     1. deletes the existing component
//     2. creates a new component with the same alias as
//        the existing component
//     3. sets the `module` property to the new module value
//     4. sets the properties that were on the existing
//        component on the new component
//
// Curran Kelleher 3/30/2014
define([], function () {

  // This function produces a stateful function.
  // This design was chosen because it avoids having a singleton,
  // allowing multiple independent dashboards to exist on one page.
  return function ProcessActions(){

    // Components that have been created by input actions
    // but have not yet had their `module` property set.
    //
    //  * Keys are aliases
    //  * Values are options objects containing properties set
    //    before the module property has been set
    var createdAliases = {},

        // Keeps track of the entire dashboard model
        // as a simple JavaScript object.
        //
        // * Keys are component aliases
        // * Values are component option objects
        existingComponents = {};

    // TODO split this into a separate module.
    // Name ideas: dashboardModel, dummyDashboard, componentModel, runtimeModel
    function updateExistingComponents(change){
      //change.deletedComponents.forEach(function (alias) {
      //  // TODO test this codepath
      //  delete existingComponents[alias];
      //});
      change.createdComponents.forEach(function (component) {
        existingComponents[component.alias] = { module: component.module };
      });
      change.updatedComponents.forEach(function (component) {
        _.extend(existingComponents[component.alias], component.options);
      });
    }

    return function processActions(actions){
      var change = {
            createdComponents: [],
            updatedComponents: [],
            deletedComponents: []
          },
          methods = {
            'create': function (alias) {
              createdAliases[alias] = {};
            },
            'delete': function (alias) {
              change.deletedComponents.push(alias);
            },
            'set': function (alias, property, value) {

              // Detect and throw an error when a property is set
              // on a component that doesn't exist
              // or is awaiting its 'module' property

              // A component "exists" when
              var componentExists = (
                // it has been set up completely, or
                existingComponents[alias] ||
                // its creation is pending, awaiting the module property, or
                createdAliases[alias] ||
                // it was created in the current action sequence
                _.findWhere(change.createdComponents, { alias: alias })
              );
              if(!componentExists){
                throw new Error([
                  "Attempted to set property '", property," = ", value,
                  "' on a component with alias '", alias, "' that hasn't been created yet."
                ].join(''));
              }

              if(property == 'module') {
                handleModuleChange(change, alias, value);
              } else {

                // Queue property changes that are set
                // after creation but before setting the module
                if(createdAliases[alias]){
                  createdAliases[alias][property] = value;
                } else {
                  // If the component exists, update it
                  getUpdatedComponent(alias).options[property] = value;
                }
              }
            }
          };

      function handleModuleChange(change, alias, module){

        // If the module is being set on a newly created component,
        if(createdAliases[alias]) {

          // transfer properties set before the module property
          getUpdatedComponent(alias).options = createdAliases[alias];

          // remove the alias from `createdAliases`
          delete createdAliases[alias];

        // If the module property changes from one value to another,
        } else {
          // delete the existing component, then
          change.deletedComponents.push(alias);

          // set values from existing component.
          getUpdatedComponent(alias).options = existingComponents[alias];
        }

        // create or recreate the component
        change.createdComponents.push({ alias: alias, module: module });

      }
      function getUpdatedComponent(alias){
        var updatedComponent = _.findWhere(change.updatedComponents, { alias: alias });
        if(!updatedComponent) {
          updatedComponent = { alias: alias, options: {} };
          change.updatedComponents.push(updatedComponent);
        }
        return updatedComponent;
      }
      actions.forEach(function (a) {
        methods[a.method](a.alias, a.property, a.value);
      });
      updateExistingComponents(change);
      return change;
    }
  }
});
