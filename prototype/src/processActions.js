// This module provides a stateful function that
// processes configuration change actions into a
// `change` object with the following properties:
//
//  * `destroyedComponents` an array of alias Strings
//    for destroyed components
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
//     1. destroys the existing component
//     2. creates a new component with the same alias as
//        the existing component
//     3. sets the `module` property to the new module value
//     4. sets the properties that were on the existing
//        component on the new component
//
// Curran Kelleher 3/29/2014
define([], function () {

  // This function produces a stateful function.
  // This design was chosen because it avoids having a singleton,
  // allowing multiple independent dashboards to exist on one page.
  return function ProcessActions(){

    // An array of component alias strings
    // for components that have been created by input actions
    // but have not yet had their `module` property set.
    var createdAliases = [];

    return function processActions(actions){
      var change = {
            createdComponents: [],
            updatedComponents: []
          },
          methods = {
            'create': function (alias) {
              createdAliases.push(alias);
            },
            'set': function (alias, property, value) {
              if(property == 'module') {
                if(_.contains(createdAliases, alias)) {
                  change.createdComponents.push({
                    alias: alias,
                    module: value
                  });
                  //_.remove(createdAliases, alias);
                } else {
                  //TODO destroy then recreate the component
                }
              } else {
                getUpdatedComponent(alias).options[property] = value;
              }
            }
          };
      function getUpdatedComponent(alias){
        var updatedComponent = _.findWhere(change.updatedComponents, {
          alias: alias
        });
        if(!updatedComponent) {
          updatedComponent = {
            alias: alias,
            options: {}
          };
          change.updatedComponents.push(updatedComponent);
        }
        return updatedComponent;
      }
      actions.forEach(function (a) {
        methods[a.method](a.alias, a.property, a.value);
      });
      console.log(change);
      return change;
    }
  }
});
