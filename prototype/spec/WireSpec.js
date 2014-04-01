// Tests the wire module.
// 
// Curran Kelleher 3/28/2014
describe('wire', function() {
  var wire;

  // Use require.js to fetch the module.
  beforeEach(function(done) {
    require(['wire'], function (module) {
      wire = module;
      done();
    });
  });

  it('should call fn once initially', function(done) {
    var model = new Backbone.Model({ x: 5 });
    wire(['x'], function (x) {
      expect(x).toBe(5);
      done();
    }, model);
  });

  it('should call fn only once for initialization and immediate update', function(done) {
    var model = new Backbone.Model({ x: 5 });
    wire(['x'], function (x) {
      expect(x).toBe(10);
      done();
    }, model);
    model.set('x', 10);
  });

  it('should call fn only once for initialization and multiple immediate updates', function(done) {
    var model = new Backbone.Model({ x: 5 });
    wire(['x'], function (x) {
      expect(x).toBe(30);
      done();
    }, model);
    model.set('x', 10);
    model.set('x', 20);
    model.set('x', 30);
  });

  it('should call fn with multiple dependency properties', function(done) {
    var model = new Backbone.Model({ x: 5, y: 6, z: 7 });
    wire(['x', 'y', 'z'], function (x, y, z) {
      expect(x).toBe(5);
      expect(y).toBe(6);
      expect(z).toBe(7);
      done();
    }, model);
  });

  it('should call fn with multiple dependency properties in the order specified', function(done) {
    var model = new Backbone.Model({ x: 5, y: 6, z: 7 });
    wire(['x', 'z', 'y'], function (x, z, y) {
      expect(x).toBe(5);
      expect(y).toBe(6);
      expect(z).toBe(7);
      done();
    }, model);
  });

  it('should call fn with multiple dependency properties only once after several updates', function(done) {
    var model = new Backbone.Model({ x: 5, y: 6, z: 7 });
    wire(['x', 'y', 'z'], function (x, y, z) {
      expect(x).toBe(8);
      expect(y).toBe(9);
      expect(z).toBe(10);
      done();
    }, model);
    model.set('x', 8);
    model.set('y', 9);
    model.set('z', 1000);
    model.set('z', 100);
    model.set('z', 10);
  });

  describe('should call fn with a single dependency property', function(done) {
    var model = new Backbone.Model({ x: 5 }),
        expectedX,
        doneCallback;

    it('once on initialization',function(done) {
      doneCallback = done;
      expectedX = 5;

      wire(['x'], function (x) {
        expect(x).toBe(expectedX);
        doneCallback();
      }, model);
    });

    it('once after asynchronous update',function(done) {
      doneCallback = done;
      expectedX = 10;
      model.set('x', 10);
    });

    it('twice after two asynchronous updates',function(done) {
      doneCallback = done;
      expectedX = 100;
      model.set('x', 100);
    });

    it('three times after two asynchronous updates and several synchronous updates',function(done) {
      doneCallback = done;
      expectedX = 4;
      model.set('x', 0);
      model.set('x', 1);
      model.set('x', 2);
      model.set('x', 3);
      model.set('x', 4);
    });
  });

  describe('should call fn with multiple dependency properties', function(done) {
    var model = new Backbone.Model({ x: 5, y: 6, z: 7}),
        expectedX,
        expectedY,
        expectedZ,
        doneCallback;

    it('once on initialization', function (done) {
      doneCallback = done;
      expectedX = 5;
      expectedY = 6;
      expectedZ = 7;

      wire(['x', 'y', 'z'], function (x, y, z) {
        expect(x).toBe(expectedX);
        expect(y).toBe(expectedY);
        expect(z).toBe(expectedZ);
        doneCallback();
      }, model);
    });

    it('once after asynchronous update of one dependency property', function (done) {
      doneCallback = done;
      expectedX = 10;
      model.set('x', 10);
    });

    it('twice after subsequent synchronous update of multiple dependency properties', function (done) {
      doneCallback = done;
      expectedY = 11;
      model.set('y', 11);
      expectedZ = 12;
      model.set('z', 12);
    });
  });

  it('should work as model.wire assigned', function (done) {
    var model = new Backbone.Model({ x: 5 });
    model.wire = wire;
    model.wire(['x'], function (x) {
      expect(x).toBe(5);
      done();
    });
  });

  it('should work as model.wire on any model', function (done) {
    var model = new Backbone.Model({ x: 5 });
    model.wire(['x'], function (x) {
      expect(x).toBe(5);
      done();
    });
  });

});
