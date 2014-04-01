/**
 * Tests the udc module.
 *
 * Curran Kelleher 3/30/2014
 */
describe('udc', function() {
  // The udc module, a factory function for UDC contexts
  var UDC,
      // A udc context used throughout specs.
      udc,
      // Common things used in many specs
      source = 'United Nations',
      dataSet = 'Population Estimates';

  // Use require.js to fetch the module.
  it('should load the AMD module', function (done) {
    require(['udc'], function (module) {
      UDC = module;
      udc = UDC();
      done();
    });
  });
  
  it('should load a data set', function (done) {
    udc.load('data/un_population/un_population', done);
  });

  it('should list sources', function () {
    var sources = udc.listSources();
    expect(sources.length).toBe(1);
    expect(sources[0]).toBe(source);
  });

  it('should list data sets', function () {
    var dataSets = udc.listDataSets(source);
    expect(dataSets.length).toBe(1);
    expect(dataSets[0]).toBe(dataSet);
  });

  it('should list dimensions for a data set', function () {
    var dimensions = udc.listDimensions(source, dataSet);
    expect(dimensions.length).toBe(2);
    expect(dimensions).toContain('Time');
    expect(dimensions).toContain('Space');
  });

  it('should list measures for a data set', function () {
    var measures = udc.listMeasures(source, dataSet);
    expect(measures.length).toBe(1);
    expect(measures).toContain('Population');
  });

  it('should list members of the Time dimension', function () {
    var dimension = 'Time',
        members = udc.getDomain(source, dataSet, dimension),
        expectedMembers = _.range(1950, 2011).map(String);
    expect(members.length).toBe(expectedMembers.length);
    expectedMembers.forEach(function (year) {
      expect(members).toContain(year);
    });
  });

  it('should list members of the Space dimension', function () {
    var dimension = 'Space',
        members = udc.getDomain(source, dataSet, dimension),
        expectedMembers = [
          '900' /* World */, 
          '903' /* Africa */, 
          '935' /* Asia */, 
          '908' /* Europe */, 
          '904' /* Latin America and the Caribbean */, 
          '905' /* Northern America */, 
          '909' /* Oceania */
          /* ... more are there but just check these */
        ];
    expectedMembers.forEach(function (member) {
      expect(members).toContain(member);
    });
  });

  it('should look up a measure value for a data cube cell', function () {
    var cell = { 'Space': '900', /* World */ 'Time': '2010' },
        measure = 'Population',
        value = udc.getValue(source, dataSet, cell, measure);
    expect(value).toBe(6916183.482 * 1000);
  });

  it('should waitFor() a data set to load', function (done) {
    // Create a context local to this spec,
    // so the data set is not loaded twice into the same context.
    var localUDC = UDC();
    
    localUDC.load('data/un_population/un_population');

    localUDC.waitFor(source, dataSet, function () {
      var cell = { 'Space': '900', /* World */ 'Time': '2010' },
          measure = 'Population',
          value = localUDC.getValue(source, dataSet, cell, measure);
      expect(value).toBe(6916183.482 * 1000);
      done();
    });
  });
});
