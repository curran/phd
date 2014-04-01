// A Node.js script that transforms `raw.csv` into `../un_population.csv`
// Curran Kelleher 3/30/2014
var fs = require('fs');

fs.readFile('./raw.csv', 'utf8', function (err, data) {
  var rows = data.split('\r\n').slice(1),
      un_code_name_concordance = ['countryCode,countryName'];
  rows.splice(rows.length - 1, 1);
  rows.forEach(function (row) {
    var entries = parse(row),
        countryName = unparse(entries[1]),
        countryCode = entries[3];
//    entries.forEach(function (entry, i) {
//      console.log(i, entry);
//    });
//    throw Error;
    un_code_name_concordance.push([countryCode, countryName].join(','));
  });
  output('../un_code_name_concordance.csv', un_code_name_concordance.join('\n'));
});


function output(name, data){
  fs.writeFile('./'+name, data, function(err) {
    if(err) { console.log(err); }
    else { console.log("Wrote "+name); }
  }); 
}

// Parse a CSV row, accounting for commas inside quotes
function parse(row){
  var insideQuote = false,
      entries = [],
      entry = [];
  row.split('').forEach(function (character) {
    if(character === '"') {
      insideQuote = !insideQuote;
    } else {
      if(character == "," && !insideQuote) {
        entries.push(entry.join(''));
        entry = [];
      } else {
        entry.push(character);
      }
    }
  });
  entries.push(entry.join(''));
  return entries;
}

// Output a string for CSV.
// If a comma is present, the string is quoted.
function unparse(entry){
  if(entry.split('').indexOf(',') != -1) {
    return '"' + entry + '"';
  } else {
    return entry;
  }
}
