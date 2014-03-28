/**
 * Tests the layout module.
 *
 * Curran Kelleher 3/28/2014
 */
describe('layout', function() {
  var layout;

  // Use require.js to fetch the module.
  beforeEach(function (done) {
    require(['layout'], function (module) {
      layout = module;
      done();
    });
  });

  it('should layout a single child to the full box size', function () {
    
  });
});
