/**
* This module implements nested box layout
* for visualizations within a dashboard.
*
* Curran Kelleher 3/26/2014
*/
define([], function () {

  // The constructor function.
  return function (options, dashboard) {

    // Call once to initialize
    updateLayout();

    // Call whenever the browser window changes size
    window.addEventListener('resize', updateLayout);

    // Computes the layout based on the dashboard div size
    // and the configured layout tree.
    // Sets the 'box' property on each visualization model
    // to an object with (x, y, width, height) in pixels.
    function updateLayout(){
      var div = dashboard.div.node(),
          width = div.clientWidth,
          height = div.clientHeight,
          layout = computeLayout(options, 0, 0, width, height, []);

      layout.forEach(function (box) {
        dashboard.getComponent(box.name, function (vis) {
          // TODO vis.set('box', box);
          vis.set('box', {
            x: box.x,
            y: box.y,
            width: box.dx,
            height: box.dy
          });
        });
      });
    }
  }

  // Computes the layout of the visualizations in the dashboard.
  // TODO clean this up
  function computeLayout(node, x, y, dx, dy, layout) {
    var totalSize = 0,
        childX, childY, childDx, childDy;
    node.children.forEach(function (child) {
      totalSize += child.size;
    });
    node.children.forEach(function (child) {
      if (node.orientation === 'horizontal') {
        childDx = dx * child.size / totalSize;
        childX = x;
        childY = y;
        childDy = dy;
        x += childDx;
      } else if (node.orientation === 'vertical') {
        childDy = dy * child.size / totalSize;
        childX = x;
        childY = y;
        childDx = dx;
        y += childDy;
      }

      if (child.children) {
        computeLayout(child, childX, childY, childDx, childDy, layout);
      } else {
        layout.push({
          name: child.name,
          x: childX,
          y: childY,
          dx: childDx,
          dy: childDy
        });
      }
    });
    return layout;
  }
});
