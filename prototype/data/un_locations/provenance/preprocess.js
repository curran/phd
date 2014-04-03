// A Node.js script that transforms `raw.csv` into `../un_population.csv`
// Curran Kelleher 3/30/2014
var fs = require('fs'),
    indices = {
      countryName: 1,
      unCountryCode: 3,
      alphaCode: 4,
      locationTypeCode: 5,
      locationTypeName: 6,
      regionCode: 7,
      regionName: 8,
      majorAreaCode: 9,
      majorAreaName: 10
    };

fs.readFile('./raw.csv', 'utf8', function (err, data) {

  // Split the input CSV into rows
  var rows = data.split('\r\n').slice(1),
      parsedRows;

  // Remove the last entry, which is blank
  rows.splice(rows.length - 1, 1);

  // Parse each line string as CSV
  parsedRows = rows.map(parse);

  computeUnLocationsTable(parsedRows);
  computeUnLocationsHierarchy(parsedRows);
});

function computeUnLocationsTable(parsedRows){
  var columnNames = [ 'countryName', 'unCountryCode', 'alphaCode' ],
      outputRows = parsedRows.map(function (entries) {
        return columnNames.map(function (columnName) {
          return unparse(entries[indices[columnName]]);
        }).join(',')
      }),
      table = [columnNames.join(',')].concat(outputRows);
  output('../un_locations_concordance.csv', table.join('\n'));
}

function computeUnLocationsHierarchy(parsedRows){
  // TODO
  //parsedRows.forEach(function (entries) {
  //  var 
  //}),
  //table = [columnNames.join(',')].concat(outputRows);
  //output('../un_locations_concordance.csv', table.join('\n'));
}

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

