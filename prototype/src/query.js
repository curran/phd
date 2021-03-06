// A module that queries Universal Data Cube data.
//
// Curran Kelleher 4/9/2014
define([], function () {
  return function (dashboard) {
    var model = new Backbone.Model();
    model.wire(['source', 'dataSet', 'query'], function (source, dataSet, query) {

      // Get the `data` component from the dashboard configuration,
      // which is responsible for loading data sources.
      dashboard.getComponent('data', function (dataComponent) {

        // Extract the UDC context from the `data` component.
        var udc = dataComponent.udc;

        // Wait for the data set to load.
        udc.waitFor(source, dataSet, function () {

          // Query the data cube for the X dimension domain.
          /* TODO refactor the API so (source, dataSet) are not needed */
          var xDomainCodes = udc.getDomain(source, dataSet, query.x),
              xDomainCodeList = udc.getCodeList(source, dataSet, query.x),

              /* TODO generalize handling of X dimensions, special case Time */
              // Parse X dimension domain values into JS Date objects.
              xDomainDates = xDomainCodes.map( function (yearStr) {
                return new Date(yearStr, 0);
              }),
              // Use the `slice` option as the basis for the current cell.
              cell = _.clone(query.slices);

          model.set('result', xDomainCodes.map(function (code, i) {

            // Set the X dimension value for the current cell
            // to the X domain value.
            cell[query.x] = {
              code: code,
              codeList: xDomainCodeList
            };
            
            // Map X domain objects to data element objects with
            return {

              // * `x` The date corresponding to the X domain value.
              x: xDomainDates[i],

              // * `y` The measure value from the data cube for
              // the current cell and the configured Y measure.
              y: udc.getValue(source, dataSet, cell, query.y)
            };
          }));
        });
      });
    });
    return model;
  };
});
