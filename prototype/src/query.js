// A module that queries Universal Data Cube data.
//
// Curran Kelleher 4/9/2014
define([], function () {
  return function (dashboard) {
    return new Backbone.Model().wire('query', function (dataOptions, set) {
      // Get the `data` component from the dashboard configuration,
      // which is responsible for loading data sources.
      dashboard.getComponent('data', function (dataComponent) {

        // Extract the UDC context from the `data` component.
        var udc = dataComponent.udc,
            source = dataOptions.source,
            dataSet = dataOptions.dataSet;

        // Wait for the data set to load.
        udc.waitFor(source, dataSet, function () {

          // Query the data cube for the X dimension domain.
          /* TODO refactor the API so (source, dataSet) are not needed */
          var xDomainCodes = udc.getDomain(source, dataSet, dataOptions.x),
              xDomainCodeList = udc.getCodeList(source, dataSet, dataOptions.x),

              /* TODO generalize handling of X dimensions, special case Time */
              // Parse X dimension domain values into JS Date objects.
              xDomainDates = xDomainCodes.map( function (yearStr) {
                return new Date(yearStr, 0);
              }),
              // Use the `slice` option as the basis for the current cell.
              cell = _.clone(dataOptions.slices);

          // Call the callback with (x, y) pairs.
          set('result', xDomainCodes.map(function (code, i) {

            // Set the X dimension value for the current cell
            // to the X domain value.
            cell[dataOptions.x] = {
              code: code,
              codeList: xDomainCodeList
            };
            
            // Map X domain objects to data element objects with
            return {

              // * `x` The date corresponding to the X domain value.
              x: xDomainDates[i],

              // * `y` The measure value from the data cube for
              // the current cell and the configured Y measure.
              y: udc.getValue(source, dataSet, cell, dataOptions.y)
            };
          }));
        });
      });
    });
  };
});
