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
