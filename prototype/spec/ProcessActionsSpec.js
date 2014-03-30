/**
 * Tests the processActions module.
 *
 * Curran Kelleher 3/28/2014
 */
describe('processActions', function() {
  var ProcessActions,

      // A sequence of actions used in many specs,
      // creates a new component and sets its module property.
      createFoo = [
        action('create', 'foo'),
        action('set', 'foo', 'module', 'fooModule')
      ];

  // Use require.js to fetch the module.
  beforeEach(function (done) {
    require(['processActions'], function (module) {
      ProcessActions = module;
      done();
    });
  });

  it('should process a sequence of actions that creates a component', function () {
    var change = ProcessActions()(createFoo);
    expect(change.createdComponents.length).toBe(1);
    expect(change.createdComponents[0].alias).toBe('foo');
    expect(change.createdComponents[0].module).toBe('fooModule');
  });

  it('should defer creation until a module property has been set', function () {
    // Create a new context
    var processActions = ProcessActions(),
        change = processActions([ action('create', 'foo') ]);
    expect(change.createdComponents.length).toBe(0);
    change = processActions([ action('set', 'foo', 'module', 'fooModule') ]);
    expect(change.createdComponents.length).toBe(1);
    expect(change.createdComponents[0].alias).toBe('foo');
    expect(change.createdComponents[0].module).toBe('fooModule');
  });

  it('should process a sequence of actions that updates a component after it was created', function () {

    var processActions = ProcessActions(),
        change = processActions(createFoo);
    change = processActions([ action('set', 'foo', 'x', 5) ]);

    expect(change.updatedComponents.length).toBe(1);
    expect(change.updatedComponents[0].alias).toBe('foo');
    expect(change.updatedComponents[0].options.x).toBe(5);
  });

  it('should process a single sequence of actions that creates and updates a component', function () {

    var processActions = ProcessActions(),
        change = processActions([
          action('create', 'foo'),
          action('set', 'foo', 'module', 'fooModule'),
          action('set', 'foo', 'x', 5)
        ]);

    expect(change.createdComponents.length).toBe(1);
    expect(change.createdComponents[0].alias).toBe('foo');
    expect(change.createdComponents[0].module).toBe('fooModule');

    expect(change.updatedComponents.length).toBe(1);
    expect(change.updatedComponents[0].alias).toBe('foo');
    expect(change.updatedComponents[0].options.x).toBe(5);
  });

  it("should throw an error when a component is updated that hasn't been created first", function () {
    expect(function () {
      ProcessActions()([ action('set', 'foo', 'x', 5) ]);
    }).toThrow();
  });

  it('should process a sequence of actions that updates several properties', function () {
    var processActions = ProcessActions(),
        change = processActions(createFoo);
    change = processActions([ 
      action('set', 'foo', 'x', 5),
      action('set', 'foo', 'y', 10)
    ]);
    expect(change.updatedComponents.length).toBe(1);
    expect(change.updatedComponents[0].alias).toBe('foo');
    expect(change.updatedComponents[0].options.x).toBe(5);
    expect(change.updatedComponents[0].options.y).toBe(10);
  });
  
  it('should process a sequence of actions that deletes a component', function () {
    var processActions = ProcessActions(),
        change = processActions(createFoo);
    change = processActions([action('delete', 'foo')]);
    expect(change.deletedComponents.length).toBe(1);
    expect(change.deletedComponents[0]).toBe('foo');
  });

  it('should process a changing module property by deleting then recreating the component', function () {
    var processActions = ProcessActions();
    var change = processActions(createFoo);

    change = processActions([ action('set', 'foo', 'module', 'anotherModule') ]);

    expect(change.deletedComponents.length).toBe(1);
    expect(change.deletedComponents[0]).toBe('foo');

    expect(change.createdComponents.length).toBe(1);
    expect(change.createdComponents[0].alias).toBe('foo');
    expect(change.createdComponents[0].module).toBe('anotherModule');
  });

  it('should process a changing module property and transfer old values', function () {
    var processActions = ProcessActions(),
        change;
    processActions(createFoo);
    processActions([
      action('set', 'foo', 'x', 7),
      action('set', 'foo', 'y', 11)
    ]);

    change = processActions([ action('set', 'foo', 'module', 'anotherModule') ]);

    expect(change.deletedComponents.length).toBe(1);
    expect(change.deletedComponents[0]).toBe('foo');

    expect(change.createdComponents.length).toBe(1);
    expect(change.createdComponents[0].alias).toBe('foo');
    expect(change.createdComponents[0].module).toBe('anotherModule');

    expect(change.updatedComponents.length).toBe(1);
    expect(change.updatedComponents[0].alias).toBe('foo');
    expect(change.updatedComponents[0].options.x).toBe(7);
    expect(change.updatedComponents[0].options.y).toBe(11);
  });

  it('should account for properties set before a module property has been set', function () {
    var processActions = ProcessActions(),
        change = processActions([ action('create', 'foo') ]);

    expect(change.createdComponents.length).toBe(0);

    change = processActions([ action('set', 'foo', 'x', 80), ]);

    expect(change.updatedComponents.length).toBe(0);

    change = processActions([ action('set', 'foo', 'y', 800), ]);

    expect(change.updatedComponents.length).toBe(0);

    change = processActions([ action('set', 'foo', 'module', 'fooModule') ]);

    expect(change.createdComponents.length).toBe(1);
    expect(change.createdComponents[0].alias).toBe('foo');
    expect(change.createdComponents[0].module).toBe('fooModule');

    expect(change.updatedComponents.length).toBe(1);
    expect(change.updatedComponents[0].alias).toBe('foo');
    expect(change.updatedComponents[0].options.x).toBe(80);
    expect(change.updatedComponents[0].options.y).toBe(800);
  });

  function action(method, alias, property, value) {
    return {
      method: method,
      alias: alias,
      property: property,
      value: value
    };
  }
});
