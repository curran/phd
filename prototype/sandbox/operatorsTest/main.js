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
      var popCube = createCubeFromTable(popTable),
          gdpCube = createCubeFromTable(gdpTable),
          concordance = createConcordanceFromTable(concordanceTable),
          cube = merge(popCube, gdpCube, concordance);
//      console.log(JSON.stringify(concordance, null, 2));
    });
  });
});

function createCubeFromTable(table) {
  var cube = {
        dimensions: [],
        measures: [],
        observations: []
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

    cube.observations.push({ cell: cell, values: values });
  });

  return cube;

}
function createConcordanceFromTable(table) {
  // Helps translate between codeLists.
  // Keys are codeList names
  // Values are index objects with:
  //  * Keys are codes
  //  * Values are equivalence class objects with
  //    * Keys are codeLists
  //    * Values are member objects with properties
  //      * codeList
  //      * code
  var indices = {},
      codeLists = [],
      // Keys are column names
      // Values are codeList names
      columnsByCodeList = {};

  table.dimensionColumns.forEach(function (dimensionColumn) {
    var column = dimensionColumn.column,
        codeList = dimensionColumn.codeList;
    codeLists.push(codeList);
    columnsByCodeList[codeList] = column;
  });

  function getIndex(codeList){
    return indices[codeList] || (indices[codeList] = {});
  }
  
  table.rows.forEach(function (row) {
    // Keys are codeLists
    // Values are codes
    var equivalenceClass = {};

    codeLists.forEach(function (codeList) {
      var column = columnsByCodeList[codeList],
          code = row[column],
          member = {
            codeList: codeList,
            code: code
          };
      equivalenceClass[codeList] = member;
      getIndex(codeList)[code] = equivalenceClass;
    });
  });
  //TODO assert that all dimensions are the same in each of table.dimensionColumns
  return {
    dimension: table.dimensionColumns[0].dimension,
    codeLists: codeLists,
    indices: indices
  };
}

function merge(cubeA, cubeB, concordance) {
  var canonicalCubeA = canonicalizeCube(cubeA, concordance),
      canonicalCubeB = canonicalizeCube(cubeB, concordance);
  // transform cubes to use canonical member identifiers
  // find the union of codes present
  // for each code in the union,
  // add all measure values from both cubes
  //   if same measure present in both, take average

  console.log(JSON.stringify(canonicalCubeA, null, 2));
  console.log(JSON.stringify(canonicalCubeB, null, 2));

  return canonicalCubeA;
}

// TODO generalize to multiple concordance tables
function canonicalizeCube(cube, concordance){

  // For each dimension, choose a canonical codeList
  // based on alphanumeric sorting

  // Keys are dimensions
  // values are canonical codeLists chosen for each dimension
  var canonicalCodeLists = {};

  // TODO for each concordance
  canonicalCodeLists[concordance.dimension] = concordance.codeLists.sort()[0];

  function canonicalizeMember(dimension, member){
    return concordance.indices[member.codeList][member.code][canonicalCodeLists[dimension]];
  }


  return {
    dimensions: cube.dimensions,
    measures: cube.measures,
    observations: cube.observations.map(function (observation) {
      var canonicalCell = {};

      // Canonicalize the codes used for each dimension
      cube.dimensions.forEach(function (dimension) {
        var member = observation.cell[dimension];
        canonicalCell[dimension] = canonicalizeMember(dimension, member);
      });

      return {
        cell: canonicalCell,
        values: observation.values
      };
    })
  }; 
}

// TODO merge cubes

// TODO merge hierarchies
