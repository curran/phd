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

  // A convenience function that writes part of the unit test,
  // for use only while developing tests.
  function writeTest(actions){
    actions.forEach(function (action) {
      console.log("expect(actions).toContain('"+action+"');");
    });
  }

  it('should handle one added alias', function() {
    var actions = diff({}, { foo: { x: 50, y: 40 } });
    expect(actions[0]).toBe('create(foo)');
    expect(actions).toContain('set(foo, x, 50)');
    expect(actions).toContain('set(foo, y, 40)');
    expect(actions.length).toBe(3);
  });

  it('should handle several added aliases', function() {
    var actions = diff(
      { baz: { a: 5 } },
      { baz: { a: 5 }, foo: { x: 50 }, bar: { y: 40 } }
    );
    expect(actions).toContain('create(foo)');
    expect(actions).toContain('set(foo, x, 50)');
    expect(actions.indexOf('create(foo)'))
      .toBeLessThan(actions.indexOf('set(foo, x, 50)'));
    expect(actions).toContain('create(bar)');
    expect(actions).toContain('set(bar, y, 40)'); 
    expect(actions.indexOf('create(bar)'))
      .toBeLessThan(actions.indexOf('set(bar, y, 40)'));

    expect(actions.length).toBe(4);
  });

  it('should handle one removed alias', function() {
    var actions = diff({ foo: { x: 50, y: 40 } }, {});
    expect(actions[0]).toBe('destroy(foo)');
    expect(actions.length).toBe(1);
  });

  it('should handle several added aliases', function() {
    var actions = diff(
      { baz: { a: 5 }, foo: { x: 50 }, bar: { y: 40 } },
      { baz: { a: 5 } }
    );
    expect(actions).toContain('destroy(foo)');
    expect(actions).toContain('destroy(bar)');
    expect(actions.length).toBe(2);
  });

  it('should handle one added property', function() {
    var actions = diff(
      { foo: { y: 40 } },
      { foo: { x: 50, y: 40 } }
    );
    expect(actions[0]).toBe('set(foo, x, 50)');
    expect(actions.length).toBe(1);
  });

  it('should handle several added properties', function() {
    var actions = diff(
      { foo: { y: 40 } },
      { foo: { x: 50, y: 40, z: 100, width: 35 } }
    );
    expect(actions).toContain('set(foo, x, 50)');
    expect(actions).toContain('set(foo, z, 100)');
    expect(actions).toContain('set(foo, width, 35)');
    expect(actions.length).toBe(3);
  });

  it('should handle one updated property', function() {
    var actions = diff(
      { foo: { x: 30, y: 40 } },
      { foo: { x: 60, y: 40 } }
    );
    expect(actions[0]).toBe('set(foo, x, 60)');
    expect(actions.length).toBe(1);
  });

  it('should handle several updated properties', function() {
    var actions = diff(
      { foo: { x: 50, y: 45, z: 100, width: 35 } },
      { foo: { x: 50, y: 40, z: 100, width: 30 } }
    );
    expect(actions).toContain('set(foo, y, 40)'); 
    expect(actions).toContain('set(foo, width, 30)');
    expect(actions.length).toBe(2);
  });

  it('should handle one removed property', function() {
    var actions = diff(
      { foo: { x: 30, y: 40 } },
      { foo: { y: 40 } }
    );
    expect(actions[0]).toBe('unset(foo, x)');
    expect(actions.length).toBe(1);
  });

  it('should handle several removed properties', function() {
    var actions = diff(
      { foo: { x: 50, y: 40, z: 100, width: 80 } },
      { foo: { y: 40 } }
    );
    expect(actions).toContain('unset(foo, x)');
    expect(actions).toContain('unset(foo, z)');
    expect(actions).toContain('unset(foo, width)'); 
    expect(actions.length).toBe(3);
  });

  it('should handle all cases combined', function() {
    var actions = diff(
      { foo: { x: 50, y: 40, z: 100 }, baz: { a: 5 } },
      { foo: { x: 30, y: 40, width: 50 }, bar: { d: 10} }
    );
    
    // Added alias: bar
    expect(actions).toContain('create(bar)');
    expect(actions).toContain('set(bar, d, 10)');
    expect(actions.indexOf('create(bar)'))
      .toBeLessThan(actions.indexOf('set(bar, d, 10)'));

    // Removed alias: baz
    expect(actions).toContain('destroy(baz)');

    // Static property: foo.y

    // Updated property: foo.x
    expect(actions).toContain('set(foo, x, 30)');

    // Added property: foo.width
    expect(actions).toContain('set(foo, width, 50)');

    // Removed property: foo.z
    expect(actions).toContain('unset(foo, z)');

    expect(actions.length).toBe(6);
  });
});
