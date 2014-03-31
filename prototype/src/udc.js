// This module implements the Universal Data Cube client.
// Curran Kelleher 3/30/2014
define([], function () {
  return function UDC(){
    // The index of data sources.
    //  * Keys are source names
    //  * Values are `source` objects with
    //    * Keys are data set names
    //    * Values are `dataSet` objects with
    //      * `dimensions` an object with
    //        * Keys are UDC Dimension names
    //        * Values are `dimension` objects with
    //          * `column` the name of the column in the data table
    //          * `codeList` the name of the UDC CodeList used in the table
    //          * `domain` the set of codes actually present in the data table
    //      * `measures` an object with
    //        * Keys are UDC Measure names
    //        * Values are `measure` objects with
    //          * `column` the name of the column in the data table
    //          * `scale` the multiplication factor used in the table
    //      * `table` the data table from the CSV file
    //      * `index` the index mapping cells to values, an object with
    //         * Keys are canonical keys for data cube cells
    //         * Values are objects with
    //           * Keys are UDC Measure names
    //           * Values are numeric valies
    var sources = {};
    return {
      //TODO handle failures, bogus URLs
      load: function (url, callback) {
        d3.json(url + '.json', function (dataSet) {
          var dimensionNames = _.keys(dataSet.dimensions).sort(),
              measureNames = _.keys(dataSet.measures);
          // TODO validate config
          //TODO var source = getSource(config.source);
          var source = sources[dataSet.source] = {};
          source[dataSet.name] = dataSet;

          d3.csv(url + '.csv', function (table) {
            dataSet.table = table;

            // Compute dimension domains
            dimensionNames.forEach(function (dimensionName) {
              var dimension = dataSet.dimensions[dimensionName];
              dimension.domain = domain(table, dimension.column);
            });

            // Build the index
            dataSet.index = {};
            table.forEach(function (row) {
              var cell = {}, values = {};
              dimensionNames.forEach(function (dimensionName) {
                var dimension = dataSet.dimensions[dimensionName];
                cell[dimensionName] = row[dimension.column];
              });
              measureNames.forEach(function (measureName) {
                var measure = dataSet.measures[measureName];
                values[measureName] = parseFloat(row[measure.column]);
              });
              // Avg time to load UN data with this method is 220 ms
              //dataSet.index[keyFromCell(cell)] = values;

              // Avg time to load UN data with this method is 140 ms
              dataSet.index[key(cell, dimensionNames)] = values;
            });
            
            callback();
          });
        });
      },
      listSources: function () { return _.keys(sources); },
      listDataSets: function (source) { return _.keys(sources[source]); },
      listDimensions: function (source, dataSet) {
        return _.keys(sources[source][dataSet].dimensions);
      },
      listMeasures: function (source, dataSet) {
        return _.keys(sources[source][dataSet].measures);
      },
      getDomain: function (source, dataSet, dimension) {
        return sources[source][dataSet].dimensions[dimension].domain;
      },
      getValue: function (source, dataSet, cell, measure) {
        // TODO multiply by scale
        return sources[source][dataSet].index[keyFromCell(cell)][measure];
      },
      waitFor: function waitFor(source, dataSet, callback) {
        var exists = sources[source] && sources[source][dataSet],
            loaded = exists && sources[source][dataSet].table;
        if(loaded){
          callback();
        } else {
          setTimeout(function () {
            waitFor(source, dataSet, callback);
          }, 10);
        }
      }
    };
  };

  // `cell` is an object with
  //  * Keys are UDC Dimension names
  //  * Values are codes
  function keyFromCell(cell){
    return key(cell, _.keys(cell).sort());
  }
  function key(cell, sortedDimensionNames){
    return sortedDimensionNames.map(function (dimensionName) {
      return cell[dimensionName];
    }).join('|');
  }

  // Computes the set of unique codes for a given dimension.
  function domain(table, column){
    var set = {};
    table.forEach(function (row) { set[row[column]] = true; });
    return _.keys(set);
  }
});
