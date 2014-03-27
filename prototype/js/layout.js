/**
* This module implements nested box layout
* for visualizations within a dashboard.
*
* Curran Kelleher 3/27/2014
*/
define(['wire'], function (wire) {

  // The constructor function.
  return function (dashboard) {

    var model = new Backbone.Model({
      tree: {}
    });

    // Call once to initialize
    // TODO refactor
    updateLayout();

    // Call whenever the browser window changes size
    // TODO refactor
    window.addEventListener('resize', updateLayout);

    // Call whenever the layout tree is set on the model.
    wire(['tree'], updateLayout, model);

    // Computes the layout based on the dashboard div size
    // and the configured layout tree.
    // Sets the 'box' property on each visualization model
    // to an object with (x, y, width, height) in pixels.
    function updateLayout(){
      var div = dashboard.div.node(),
          box = {
            x: 0,
            y: 0,
            width: div.clientWidth,
            height: div.clientHeight
          },
          layout = computeLayout(model.get('tree'), box);

      layout.forEach(function (layoutElement) {
        dashboard.getComponent(layoutElement.name, function (component) {
          component.set('box', layoutElement.box);
        });
      });
    }

    return model;
  }

  // Computes the layout of the visualizations in the dashboard.
  //
  // Arguments:
  //
  // 'node' - either a non-leaf node or a leaf node object.
  //
  //   If 'node' is a non-leaf node, it is expected to have the following properties:
  //
  //    * 'orientation' - either 'vertical' or 'horizontal'
  //    * 'children' - an array of child node objects
  //
  //   If 'node' is a leaf node, it is expected to have the following properties:
  //
  //    * 'name' - the alias of the visualization in the dashboard configuration
  //    * 'size' - a number that determines the size of this node within its parent
  //      * Nodes are sized based on the ratio of their 'size' property
  //        relative to the sum of all 'size' properties of sibling nodes.
  //
  // 'box' - the bounding box of the node in pixels, having (x, y, width, height) properties.
  //
  // Returns an array of layout elements, one for each leaf node of the input layout tree.
  // Each layout element has the following properties:
  //
  //  * 'name' - the alias of the visualization in the dashboard configuration
  //  * 'box' - the bounding box of the visualization in pixels computed by the layout,
  //            having (x, y, width, height) properties.
  function computeLayout(node, box) {
    var totalSize = sum(node.children, 'size');
    return _.reduce(node.children, function (layoutElements, child) {
      var childBox = _.clone(box);
      if (node.orientation === 'horizontal') {
        childBox.width = box.width * child.size / totalSize;
        box.x += childBox.width;
      } else if (node.orientation === 'vertical') {
        childBox.height = box.height * child.size / totalSize;
        box.y += childBox.height;
      }
      if (child.children) {
        return layoutElements.concat(computeLayout(child, childBox));
      } else {
        return layoutElements.concat({
          name: child.name,
          box: childBox
        });
      }
    }, []);
  }

  // Sums property values in an array.
  // See http://underscorejs.org/#reduce
  function sum(arr, property) {
    return _.reduce(arr, function(memo, item){
      return memo + item[property];
    }, 0);
  }
});
