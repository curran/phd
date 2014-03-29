// Computes the layout of the visualizations in the dashboard.
//
// Arguments:
//
// * `node` - either a non-leaf node or a leaf node object.
//
//     If `node` is a non-leaf node, it is expected to have the following properties:
//
//      * `orientation` - either
//        * `vertical`, meaning this node is subdivided by vertical splits
//          with children spreading from left to right, or
//        * `horizontal`, meaning this node is subdivided by horizontal splits
//          with children spreading from top to bottom
//      * `children` - an array of child node objects
//
//     If `node` is a leaf node, it is expected to have the following properties:
//
//      * `name` - the alias of the visualization in the dashboard configuration
//      * `size` - a number that determines the size of this node within its parent
//        * Nodes are sized based on the ratio of their `size` property
//          relative to the sum of all `size` properties of sibling nodes.
//
// * `box` - the bounding box of the node in pixels, having (x, y, width, height) properties.
//
//   Returns an array of layout elements, one for each leaf node of the input layout tree.
//   Each layout element has the following properties:
//
//    * `name` - the alias of the visualization in the dashboard configuration
//    * `box` - the bounding box of the visualization in pixels computed by the layout,
//      having (x, y, width, height) properties.
define([], function () {
  function computeLayout(node, box) {
    var totalSize,
        x = box.x,
        y = box.y;
    if(node.children) {
      totalSize = sum(node.children, size);
      return _.reduce(node.children, function (layoutElements, child) {
        var childBox = {x: x, y: y};
        if (node.orientation === 'vertical') {
          childBox.width = box.width * size(child) / totalSize;
          childBox.height = box.height;
          x += childBox.width;
        } else if (node.orientation === 'horizontal') {
          childBox.width = box.width;
          childBox.height = box.height * size(child) / totalSize;
          y += childBox.height;
        }
        return layoutElements.concat(computeLayout(child, childBox));
      }, []);
    } else {
      return [{ name: node.name, box: box }];
    }
  }

  function sum(arr, fn) {
    return _.reduce(arr, function(memo, item){
      return memo + fn(item);
    }, 0);
  }

  // Evaluates the size of a node.
  // Size defaults to 1 when not provided.
  function size(node) {
    return node.size ? node.size : 1;
  }

  return computeLayout;
});
