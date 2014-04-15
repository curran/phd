var fs = require('fs'),
    parser = require('./javascriptParser');

assert('function foo(x, y){ return x * 2; }', [
  '\\begin{codebox}',
  '\\Procname{$\\proc{foo}(x,y)$}',
  '\\li \\Return $ x * 2 $',
  '\\End',
  '\\end{codebox}',
].join('\n'));

assert('function foo(x, y){ return x * 4 * 5; }',[
  '\\begin{codebox}',
  '\\Procname{$\\proc{foo}(x,y)$}',
  '\\li \\Return $ x * 4 * 5 $',
  '\\End',
  '\\end{codebox}',
].join('\n'));

assert('function foo(x, y){ return x * 4 * 5 * y; }',[
  '\\begin{codebox}',
  '\\Procname{$\\proc{foo}(x,y)$}',
  '\\li \\Return $ x * 4 * 5 * y $',
  '\\End',
  '\\end{codebox}',
].join('\n'));

assert('function foo(x, y){ return min(x, y); }',[
  '\\begin{codebox}',
  '\\Procname{$\\proc{foo}(x,y)$}',
  '\\li \\Return \\proc{min}(x, y)',
  '\\End',
  '\\end{codebox}'
].join('\n'));

assert('function foo(x, y){ var x = 5; }',[
  '\\begin{codebox}',
  '\\Procname{$\\proc{foo}(x,y)$}',
  '\\li $ x \\gets 5 $',
  '\\End',
  '\\end{codebox}'
].join('\n'));

assert('function foo(x, y){ var z = 0; x = y;  }',[
  '\\begin{codebox}',
  '\\Procname{$\\proc{foo}(x,y)$}',
  '\\li $ z \\gets 0 $',
  '\\li $ x \\gets y $',
  '\\End',
  '\\end{codebox}'
].join('\n'));

assert('function sum(arr){ var total = 0; arr.forEach(function(x){ total = total + x; }); }',[
  '\\begin{codebox}',
  '\\Procname{$\\proc{sum}(arr)$}',
  '\\li $ total \\gets 0 $',
  '\\li \\For each $ x \\in arr $\\Do ',
  '\\li $ total \\gets total + x $ ',
  '\\End',
  '\\End',
  '\\end{codebox}'
].join('\n'));

assert('function sum(arr){ var total = 0; arr.forEach(function(x){ total = total + x; y = x; }); }', [
  '\\begin{codebox}',
  '\\Procname{$\\proc{sum}(arr)$}',
  '\\li $ total \\gets 0 $',
  '\\li \\For each $ x \\in arr $\\Do ',
  '\\li $ total \\gets total + x $',
  '\\li $ y \\gets x $ ',
  '\\End',
  '\\End',
  '\\end{codebox}'
].join('\n'));

function assert(javaScript, latex){
  if(!latex){
    latex = transpile(javaScript);
    console.log(latex);
    fs.writeFile('latex/pseudocode.tex', latex, function(err) {});
  } else if(latex != transpile(javaScript)){
    throw new Error('Expected ' + latex + ', got ' + transpile(javaScript));
  }
}

function transpile(javaScript){
  var tree = parser.parse(javaScript),
      insideDollars = false,
      evaluate = byType({
        Program: function (tree) {
          return tree.elements.map(evaluate)[0];
        },
        Function: function (tree) {
          var latex = [];
          latex.push('\\begin{codebox}')
          latex.push([
            '\\Procname{$\\proc{', tree.name, '}',
            '(', tree.params.join(','), ')$}'
          ].join(''));
          tree.elements.forEach(function (element) {
            latex.push('\\li ' + evaluate(element));
          });
          latex.push('\\End')
          latex.push('\\end{codebox}');
          return latex.join('\n');
        },
        FunctionCall: function (tree) {
          if(tree.name.name == 'forEach'){
            return [
              '\\For each $',
              tree.arguments[0].params[0],
              '\\in',
              tree.name.base.name,
              '$\\Do',
              tree.arguments[0].elements.map(function (element) {
                return '\n\\li ' + evaluate(element);
              }).join(''),
              '\n\\End'
            ].join(' ');
          }
          return [
            '\\proc{', tree.name.name, '}',
            '(', tree.arguments.map(function (arg) {
              return arg.name;
            }).join(', '), ')'
          ].join('');
        },
        VariableStatement: function (tree) {
          return tree.declarations.map(function (d) {
            return dollar(function () {
              return d.name + ' \\gets ' + evaluate(d.value);
            });
          }).join('\n');
        },
        X: function (tree) {
          console.log(JSON.stringify(tree));
        },
        ReturnStatement: function (tree) {
          return '\\Return ' + evaluate(tree.value);
        },
        BinaryExpression: function (tree) {
          return dollar(function () {
            return [
              evaluate(tree.left),
              tree.operator,
              evaluate(tree.right)
            ].join(' ');
          });
        },
        AssignmentExpression: function (tree) {
          return dollar(function () {
            return [
              evaluate(tree.left),
              '\\gets',
              evaluate(tree.right)
            ].join(' ');
          });
        },
        Variable: function (tree) { return tree.name; },
        NumericLiteral: function (tree) { return tree.value; }
      });
  function dollar(fn){
    var latex;
    if(insideDollars){
      latex = fn();
    } else {
      insideDollars = true;
      latex = '$ ' + fn() + ' $';
      insideDollars = false;
    }
    return latex;
  }
  return evaluate(tree);
}

function byType(fns) {
  return function(tree) {
    var fn = fns[tree.type];
    if (fn) {
      return fn(tree);
    } else {
      throw Error("not handling type " + tree.type);
    }
  };
}


