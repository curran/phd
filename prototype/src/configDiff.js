// Computes the difference between two dashboard configuration objects
// and returns the difference as a sequence of actions to be executed.
//
// TODO add an example config diff and expected actions
//
// Curran Kelleher 3/27/2014
define([], function () {

  return function (oldConfig, newConfig){
    var actions = [],
        newAliases = _.keys(newConfig),
        oldAliases = _.keys(oldConfig);

    // Handle removed aliases.
    _.difference(oldAliases, newAliases).forEach(destroy);

    newAliases.forEach(function (alias) {
      var oldOptions = oldConfig[alias],
          newOptions = newConfig[alias],
          oldKeys = _.keys(oldOptions),
          newKeys = _.keys(newOptions);

      // Handle added aliases.
      if(!oldOptions){
        create(alias);
        newKeys.forEach(function (property) {
          set(alias, property, newOptions[property]);
        });
      } else {

        // Handle added properties.
        _.difference(newKeys, oldKeys).forEach(function (property) {
          set(alias, property, newOptions[property]);
        });

        // Handle removed properties.
        _.difference(oldKeys, newKeys).forEach(function (property) {
          unset(alias, property);
        });

        // Handle updated properties.
        _.intersection(newKeys, oldKeys).forEach(function (property) {
          if(!_.isEqual(oldOptions[property], newOptions[property])){
            set(alias, property, newOptions[property]);
          }
        });
      }
    });
    function create(alias) {
      actions.push({
        method: 'create',
        alias: alias
      });
    }
    function destroy(alias) {
      actions.push({
        method: 'destroy',
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
    function unset(alias, property, value) {
      actions.push({
        method: 'unset',
        alias: alias,
        property: property
      });
    }
    return actions;
  };
});
