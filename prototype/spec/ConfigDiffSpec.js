/**
 * Tests the configDiff module.
 *
 * Curran Kelleher 3/27/2014
 */
describe('computeDiff', function() {
  var configDiff;

  // Use require.js to fetch the module.
  beforeEach(function(done) {
    require(['configDiff'], function (module) {
      configDiff = module;
      done();
    });
  });

  // Converts an action into a string
  // for convenient testing.
  function str(action) {
    return action.method + '(' + [
      action.alias,
      action.property ? ', ' + action.property : '',
      action.value ? ', ' + action.value : '',
    ].join('') + ')';
  }

  // A function that calls configDiff
  // and maps the returned actions to strings.
  function diff(oldConfig, newConfig){
    return configDiff(oldConfig, newConfig).map(str);
  }

  it('should handle added aliases', function() {
    var actions = diff({}, { foo: { x: 50, y: 40 } });
    expect(actions[0]).toBe('create(foo)');
    expect(actions).toContain('set(foo, x, 50)');
    expect(actions).toContain('set(foo, y, 40)');
    expect(actions.length).toBe(3);
  });
});

  // Test the case of an alias only in the old config
  //var actions = configDiff({
  //  foo: {
  //    x: 50,
  //    y: 40
  //  }
  //}, {});
  // should yield ["destroy(foo)"]

  // Test the case of a newly created property
  //var actions = configDiff( {
  //    foo: {
  //      y: 40
  //    },
  //  }, {
  //    foo: {
  //      x: 50,
  //      y: 40
  //    }
  //  });
  // should yield ["set(foo, x, 50)"]

  // Test the case of several newly created properties
  //var actions = configDiff( {
  //    foo: {
  //      y: 40
  //    },
  //  }, {
  //    foo: {
  //      x: 50,
  //      y: 40,
  //      z: 100,
  //      width: 35
  //    }
  //  });
  // should yield ["set(foo, x, 50)", "set(foo, z, 100)", "set(foo, width, 35)"]  

  // Test the case of an updating property
  //var actions = configDiff( {
  //    foo: {
  //      x: 30,
  //      y: 40
  //    },
  //  }, {
  //    foo: {
  //      x: 50,
  //      y: 40
  //    }
  //  });
  //// should yield ["set(foo, x, 50)"]

  // Test the case of several updating properties
  //var actions = configDiff( {
  //    foo: {
  //      x: 50,
  //      y: 45,
  //      z: 100,
  //      width: 35
  //    },
  //  }, {
  //    foo: {
  //      x: 50,
  //      y: 40,
  //      z: 100,
  //      width: 30
  //    }
  //  });
  //// should yield ["set(foo, y, 40)", "set(foo, width, 30)"] in any order

  // Test the case of a removed property
  //var actions = configDiff( {
  //    foo: {
  //      x: 50,
  //      y: 40
  //    },
  //  }, {
  //    foo: {
  //      y: 40
  //    }
  //  });
  // should yield ["unset(foo, x)"]

  // Test the case of several removed properties
  //var actions = configDiff( {
  //    foo: {
  //      x: 50,
  //      y: 40,
  //      z: 100,
  //      width: 80
  //    },
  //  }, {
  //    foo: {
  //      y: 40
  //    }
  //  });
  // should yield ["unset(foo, x)", "unset(foo, z)", "unset(foo, width)"]

  //console.log(actions.map(printAction));
