/**
 * This script implments a hard-coded data integration example.
 *
 * The data integration operations here should be generalized.
 *
 * Curran Kelleher 2/26/2013
 */

// Fetch the input files
d3.json('countryPopulations.json', function(popTable) {
  d3.json('countryGDP.json', function(gdpTable) {
    d3.json('concordance.json', function(concordanceTable) {
      var popCube = DataCube(popTable),
          gdpCube = DataCube(gdpTable),
          cube = merge(popCube, gdpCube, concordanceTable);
      console.log(cube);
    });
  });
});

function DataCube(table) {
  var cube = {
        dimensions: [],
        measures: [],
        content: []
      },
      columns = {},
      codeLists = {},
      scales = {};
  
  table.dimensionColumns.forEach(function (dimensionColumn) {
    var dimension = dimensionColumn.dimension;
    cube.dimensions.push(dimension);
    codeLists[dimension] = dimensionColumn.codeList;
    columns[dimension] = dimensionColumn.column;
  });

  table.measureColumns.forEach(function (measureColumn) {
    var measure = measureColumn.measure;
    cube.measures.push(measure);
    scales[measure] = measureColumn.scale;
    columns[measure] = measureColumn.column;
  });

  table.rows.forEach(function (row) {
    var cell = {}, values = {};

    cube.dimensions.forEach(function (dimension) {
      cell[dimension] = {
        codeList: codeLists[dimension],
        code: row[columns[dimension]]
      };
    });

    cube.measures.forEach(function (measure) {
      values[measure] = row[columns[measure]] * scales[measure];
    });

    cube.content.push({ cell: cell, values: values });
  });

  return cube;

}

function merge(cubeA, cubeB, concordance) {
  // transform cubes to use canonical member identifiers
  // find the union of codes present
  // for each code in the union,
  // add all measure values from both cubes
  //   if same measure present in both, take average

  return cube;
}

// TODO merge cubes

// TODO merge hierarchies
