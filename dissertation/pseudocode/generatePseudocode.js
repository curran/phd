var PEG = require('pegjs'),
    fs = require('fs'),
    pseudocode = [
      '\\begin{codebox}',
      '\\Procname{$\\proc{Sort}(A)$}',
      '\\li \\For $j \\gets 2$ \\To $\\attrib{A}{length}$',
      '\\li \\Do',
      '$\\id{key} \\gets A[j]$',
      '\\li \\Comment Remove $A[j]$ into the sorted sequence',
      '$A[1 \\twodots j-1]$.',
      '\\li $i \\gets j-1$',
      '\\li \\While $i > 0$ and $A[i] > \\id{key}$',
      '\\li \\Do',
      '$A[i+1] \\gets A[i]$',
      '\\li $i \\gets i-1$',
      '\\End',
      '\\li $A[i+1] \\gets \\id{key}$',
      '\\End',
      '\\end{codebox}'
    ];

fs.readFile('javascript.pegjs', 'utf8', function (err, grammar) {
  var parser = PEG.buildParser(grammar),
      tree = parser.parse('function foo(x, y){ return x * 2; };'),
      fn = tree.elements[0],
      latex = [],
      transpile = byType({
        ReturnStatement: function (tree) {
          return '\\Return ' + transpile(tree.value);
        },
        BinaryExpression: function (tree) {
          return [
            '$',
            transpile(tree.left),
            tree.operator,
            transpile(tree.right),
            '$'
          ].join(' ');
        },
        Variable: function (tree) {
          return tree.name;
        },
        NumericLiteral: function (tree) {
          return tree.value;
        },
        X: function (tree) {
          console.log(JSON.stringify(tree));
        }
      });

  if(fn.type != 'Function') {
    throw new Error('Expected JS code to contain only a function definition.');
  }
  if(!fn.name) {
    throw new Error('Expected JS code to contain a named function definition.');
  }

  console.log(fn.name);
  latex.push('\\begin{codebox}')
  latex.push('\\Procname{$\\proc{' + fn.name + '}(' + fn.params.join(',') + ')$}');
  fn.elements.forEach(function (element) {
    latex.push('\\li ' + transpile(element));
  });
  latex.push('\\End')
  latex.push('\\end{codebox}');

  console.log(latex.join('\n'));
  fs.writeFile('latex/pseudocode.tex', latex.join('\n'), function(err) {});
});


function byType(fns) {
  return function(tree) {
    var fn = fns[tree.type];
    if (fn) {
      return fn.apply(null, arguments);
    } else {
      throw Error("not handling type " + tree.type);
    }
  };
}
