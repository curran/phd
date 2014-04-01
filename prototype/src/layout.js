// This module implements nested box layout for visualization dashboards.
//
// Curran Kelleher 3/27/2014
define(['wire', 'computeLayout'], function (wire, computeLayout) {

  // The constructor function.
  return function (dashboard) {

    // The model will contain only one property,
    // `box`, which reflects the size of
    // the dashboard div in pixels.
    var model = new Backbone.Model();

    // Call once to initialize
    setBoxFromDiv();

    // Call whenever the browser window changes size
    window.addEventListener('resize', setBoxFromDiv);

    // Sets the `box` model property based on the actual
    // size of the dashboard div computed by CSS.
    function setBoxFromDiv(){
      var div = dashboard.div.node();
      model.set('box', {
        x: 0,
        y: 0,
        // Use `clientWidth` and `clientHeight` to
        // access the actual size of the dashboard div.
        width: div.clientWidth,
        height: div.clientHeight
      });
    }

    // Computes the layout based on the dashboard div size
    // and the configured layout tree whenever either one changes.
    model.wire(['tree', 'box'], function (tree, box) {
      if(tree) {
      /* TODO move null checking to wire */

        // Compute the nested box layout.
        var layout = computeLayout(tree, box);

        // Set the `box` property on each visualization model
        // to an object with (x, y, width, height) in pixels.
        layout.forEach(function (layoutElement) {
          dashboard.getComponent(layoutElement.name, function (component) {
            component.set('box', layoutElement.box);
          });
        });
      }
    });

    return model;
  }

});
