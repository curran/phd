// Tests the layout module.
// 
// Process for developing these tests:
// 
//  1. configure layout in dashboardConfig
//  2. load dashboard and visually inspect the results
//     using labeled and colored boxes
//  3. copy configuration into the spec
//  4. run writeTest(boxes) in the spec
//  5. copy the result from the spec runner console output
//  6. paste the generated test code into the spec
// 
// For examples of configuration and appearance, see:
// 
//  * ComputeLayoutSpec_exampleDashboardConfig.json
//  * ComputeLayoutSpec_exampleDashboardLayout.png
// 
// Curran Kelleher 3/28/2014
describe('computeLayout', function() {
  var computeLayout,
      unitBox = {
        x: 0,
        y: 0,
        width: 1,
        height: 1
      };

  // Use require.js to fetch the module.
  beforeEach(function (done) {
    require(['computeLayout'], function (module) {
      computeLayout = module;
      done();
    });
  });

  // calls computeLayout with the given tree and unit box
  // returns an array of strings that represent the layout elements
  function layout(tree) {
    return computeLayout(tree, unitBox).map(function (layoutElement) {
      var b = layoutElement.box;
      return [ layoutElement.name, b.x, b.y, b.width, b.height ].join(' ');
    });
  }

  // Prints a spec that expects the given set of boxes.
  function writeTest(boxes){
    boxes.forEach(function(box){
      console.log("expect(boxes).toContain('"+box+"');");
    });
  }

  it('should layout a single child to the full box size', function () {
    var boxes = layout({ name: 'foo' });
    expect(boxes).toContain('foo 0 0 1 1');
  });

  it('should layout two equally sized vertical children from left to right', function () {
    var boxes = layout ({
      orientation: 'vertical',
      children: [
        { name: 'foo', size: 1 },
        { name: 'bar', size: 1 }
      ]
    });
    // foo should be on the left
    expect(boxes).toContain('foo 0 0 0.5 1');
    // bar should be on the right
    expect(boxes).toContain('bar 0.5 0 0.5 1');
  });

  it('should layout two non-equally sized vertical children from left to right', function () {
    var boxes = layout ({
      orientation: 'vertical',
      children: [
        { name: 'foo', size: 3 },
        { name: 'bar', size: 1 }
      ]
    });
    expect(boxes).toContain('foo 0 0 0.75 1');
    expect(boxes).toContain('bar 0.75 0 0.25 1');
  });

  it('should layout three non-equally sized vertical children from left to right', function () {
    var boxes = layout ({
      'orientation': 'vertical',
      'children': [
        { 'name': 'a', 'size': 1 },
        { 'name': 'b', 'size': 2 },
        { 'name': 'c', 'size': 1 }
      ]
    });
    expect(boxes).toContain('a 0 0 0.25 1');
    expect(boxes).toContain('b 0.25 0 0.5 1');
    expect(boxes).toContain('c 0.75 0 0.25 1'); 
  });
  it('should layout three non-equally sized horizontal children from top to bottom', function () {
    var boxes = layout ({
      'orientation': 'horizontal',
      'children': [
        { 'name': 'a', 'size': 2 },
        { 'name': 'b', 'size': 1 },
        { 'name': 'c', 'size': 1 }
      ]
    });
    expect(boxes).toContain('a 0 0 1 0.5');
    expect(boxes).toContain('b 0 0.5 1 0.25');
    expect(boxes).toContain('c 0 0.75 1 0.25');
    //writeTest(boxes);
  });

  it('should use a default size of 1', function () {
    var boxes = layout ({
      'orientation': 'horizontal',
      'children': [
        { 'name': 'a', 'size': 2 },
        { 'name': 'b' },
        { 'name': 'c', 'size': 1 }
      ]
    });
    expect(boxes).toContain('a 0 0 1 0.5');
    expect(boxes).toContain('b 0 0.5 1 0.25');
    expect(boxes).toContain('c 0 0.75 1 0.25');
    //writeTest(boxes);
  });
  it('should handle a horizontal split nested within a vertical split', function () {
    var boxes = layout ({
      "orientation": "vertical",
      "children": [
        { "name": "a" },
        {
          "size": 2,
          "orientation": "horizontal",
          "children": [
            { "name": "c" },
            { "name": "d", "size": 2 },
            { "name": "e" }
          ]
        },
        { "name": "b" }
      ]
    });
    expect(boxes).toContain('a 0 0 0.25 1');
    expect(boxes).toContain('b 0.75 0 0.25 1');
    expect(boxes).toContain('c 0.25 0 0.5 0.25');
    expect(boxes).toContain('d 0.25 0.25 0.5 0.5');
    expect(boxes).toContain('e 0.25 0.75 0.5 0.25');
  });
  it('should handle a vertical split nested within a horizontal split', function () {
    var boxes = layout ({
      "orientation": "horizontal",
      "children": [
        { "name": "a" },
        {
          "size": 2,
          "orientation": "vertical",
          "children": [
            { "name": "c" },
            { "name": "d", "size": 2 },
            { "name": "e" }
          ]
        },
        { "name": "b" }
      ]
    });
    expect(boxes).toContain('a 0 0 1 0.25');
    expect(boxes).toContain('b 0 0.75 1 0.25');
    expect(boxes).toContain('c 0 0.25 0.25 0.5');
    expect(boxes).toContain('d 0.25 0.25 0.5 0.5');
    expect(boxes).toContain('e 0.75 0.25 0.25 0.5');
    //writeTest(boxes);
  });

  it('should handle doubly nested splits', function () {
    var boxes = layout ({
      "orientation": "horizontal",
      "children": [
        { "name": "a" },
        {
          "size": 2,
          "orientation": "vertical",
          "children": [
            { "name": "c" },
            {
              "size": 2,
              "orientation": "horizontal",
              "children": [
                { "name": "e" },
                { "name": "f" }
              ]
            },
            { "name": "d" }
          ]
        },
        { "name": "b" }
      ]
    });
    expect(boxes).toContain('a 0 0 1 0.25');
    expect(boxes).toContain('c 0 0.25 0.25 0.5');
    expect(boxes).toContain('e 0.25 0.25 0.5 0.25');
    expect(boxes).toContain('f 0.25 0.5 0.5 0.25');
    expect(boxes).toContain('d 0.75 0.25 0.25 0.5');
    expect(boxes).toContain('b 0 0.75 1 0.25');
    //writeTest(boxes);
  });
  it('should handle triply nested splits', function () {
    var boxes = layout ({
      "orientation": "horizontal",
      "children": [
        { "name": "a" },
        {
          "size": 2,
          "orientation": "vertical",
          "children": [
            { "name": "c" },
            {
              "size": 2,
              "orientation": "horizontal",
              "children": [
                { "name": "e" },
                {
                  "orientation": "vertical",
                  "children": [
                    { "name": "f" },
                    { "name": "g" },
                    { "name": "h" },
                    { "name": "i" }
                  ]
                }
              ]
            },
            { "name": "d" }
          ]
        },
        { "name": "b" }
      ]
    });
    expect(boxes).toContain('a 0 0 1 0.25');
    expect(boxes).toContain('c 0 0.25 0.25 0.5');
    expect(boxes).toContain('e 0.25 0.25 0.5 0.25');
    expect(boxes).toContain('f 0.25 0.5 0.125 0.25');
    expect(boxes).toContain('g 0.375 0.5 0.125 0.25');
    expect(boxes).toContain('h 0.5 0.5 0.125 0.25');
    expect(boxes).toContain('i 0.625 0.5 0.125 0.25');
    expect(boxes).toContain('d 0.75 0.25 0.25 0.5');
    expect(boxes).toContain('b 0 0.75 1 0.25');
  });
});
