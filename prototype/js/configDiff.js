/**
 * Computes the difference between two dashboard configuration objects
 * and returns the difference as a sequence of actions to be executed.
 *
 * Curran Kelleher 3/27/2014
 */
define([], function () {
  return function configDiff(oldConfig, newConfig){
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
    _.keys(newConfig).forEach(function (alias) {
      var options = newConfig[alias];
      create(alias);
      _.keys(options).forEach(function (property) {
        var value = options[property];
        set(alias, property, value);
      });
    });
    return actions;
  };
});
