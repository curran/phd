/**
 * The UDC universe singleton.
 * @namespace
 */
var Universe = (function () {

  var dimensions = {};
  return {
    /**
     * Adds a dimension to the UDC universe.
     *
     * @memberof Universe
     * @param {string} dimension A dimension name.
     */
    addDimension: function (dimension) {
      dimensions[dimension] = true;
    },
    containsDimension: function (dimension) {
      return dimensions[dimension];
    },
    /**
     * Adds a codeList to the UDC universe.
     *
     * @memberof Universe
     * @param {string} codeList A codeList name.
     */
    addCodeList: function (codeList) {
    }
    // addMeasure(string)
    // addCodeList(string)
    // addConcordanceTable(table) where
    // addHierarchy
  };
}());

/**
 * A data structure containing the raw data behind a {@link ConcordanceTable} or {@link DataCube}.
 *
 * @class
 */
function Table(){
  var dimensions = [];
  return {
    /**
     * Adds a dimension column descriptor.
     *
     * @memberof Table#
     * @param {string} dimension A dimension name from the UDC {@link Universe}.
     * @param {string} codeList A code list name from the UDC {@link Universe}.
     * @param {string} columnName The name of a column in the table that contains references 
     *   to members of the specified dimension using codes from the specified code list.
     */
    addDimension: function (dimension, codeList, columnName) {

      //type(dimension, String);
      //constraints(dimension, Universe.containsDimension);

      dimensions.push({
        dimension: dimension,
        codeList: codeList,
        columnName: columnName
      });
    },
    // addDimensionColumnDescriptor(dimension:string, codeList:string, columnName:string)
    // addMeasureColumnDescriptor(measure:string, scale:Number, column:string)
    // addRow(object) where
    //  * every key of objects matches a configured column name
    //  * each value for a dimension column is a string
    //  * each value for a measure column is a number
    // listDimensionColumnDescriptors() -> [{dimension, codeList, columnName}]
    // listMeasureColumnDescriptors() -> [{measure, scale, columnName}]
    // freeze() ensure the table is immutable
  };
}

/**
 * @constructor
 * @param {Table} table
 */
function DataCube(table){

//  object
//    properties
//    map
//    type: object, constraints: function

  type(table, {
    properties: {
      dimensions: [{
        properties: {
          dimension: {
            type: String,
            constraints: Universe.containsDimension
          },
          codeList: {
            type: String,
            constraints: Universe.containsCodeList
          },
          columnName: {
            type: String,
            constraints: function (columnName) {
              return _.every(table.content, function (row) {
                return row.hasOwnProperty(columnName);
              });
            }
          }
        }
      }],
      measures: [{
        properties: {
          measure: {
            type: String,
            constraints: Universe.containsMeasure
          },
          scale: Number,
          columnName: {
            type: String,
            constraints: function (columnName) {
              return _.every(table.content, function (row) {
                return row.hasOwnProperty(columnName);
              });
            }
          }
        }
      }],
      content: [{
        type: {
          map: {
            keys: String,
            values: { either: [String, Number]}
          }
        },
        constraints: function (row) {
          // if a dimension column,
          // values must be strings
          // if a measure column
          // values must be numbers
        }
      }]
    }
  });

  return {
    // dimensions()
    // measures()
    // domain(dimension) -> cells
    // value(cell, measure)
  };
}

/**
 * @constructor
 * @param {Table} table
 */
function ConcordanceTable(table){

  return {
    // dimension()
    // codeLists()
    // translate(code in fromCodeList, fromCodeList, toCodeList) -> code in toCodeList
  };
}
