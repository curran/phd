// This module implements the Universal Data Cube client.
//
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
    var sources = {};

    return {
      //TODO handle failures, bogus URLs
      load: function (url, callback) {
        d3.json(url + '.json', function (dataSet) {
          // TODO validate config

          //var source = getSource(config.source);
          var source = sources[dataSet.source] = {};
          source[dataSet.name] = dataSet;

          d3.csv(url + '.csv', function (table) {
            dataSet.table = table;

            // Compute dimension domains
            _.keys(dataSet.dimensions).forEach(function (name) {
              var dimension = dataSet.dimensions[name];
              dimension.domain = domain(table, dimension.column);
            });
            callback();
          });
        });
      },
      listSources: function () {
        return _.keys(sources);
      },
      listDataSets: function (source) {
        return _.keys(sources[source]);
      },
      listDimensions: function (source, dataSet) {
        return _.keys(sources[source][dataSet].dimensions);
      },
      listMeasures: function (source, dataSet) {
        return _.keys(sources[source][dataSet].measures);
      },
      getDomain: function (source, dataSet, dimension) {
        return sources[source][dataSet].dimensions[dimension].domain;
      }
    };
  };

  // Computes the set of unique codes for a given dimension.
  function domain(table, column){
    var set = {};
    table.forEach(function (row) {
      set[row[column]] = true;
    });
    return _.keys(set);
  }
});
