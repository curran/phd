/**
 * Tests the udc module.
 *
 * Curran Kelleher 3/30/2014
 */
describe('udc', function() {
  var udc;

  // Use require.js to fetch the module.
  it('should load the AMD module', function (done) {
    require(['udc'], function (UDC) {
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
    expect(sources[0]).toBe('United Nations');
  });

  it('should list data sets', function () {
    var source = 'United Nations',
        dataSets = udc.listDataSets(source);
    expect(dataSets.length).toBe(1);
    expect(dataSets[0]).toBe('Population Estimates');
  });

  it('should list dimensions for a data set', function () {
    var source = 'United Nations',
        dataSet = 'Population Estimates',
        dimensions = udc.listDimensions(source, dataSet);
    expect(dimensions.length).toBe(2);
    expect(dimensions).toContain('Time');
    expect(dimensions).toContain('Space');
  });

  it('should list measures for a data set', function () {
    var source = 'United Nations',
        dataSet = 'Population Estimates',
        measures = udc.listMeasures(source, dataSet);
    expect(measures.length).toBe(1);
    expect(measures).toContain('Population');
  });

  it('should list members of the Time dimension', function () {
    var source = 'United Nations',
        dataSet = 'Population Estimates',
        dimension = 'Time',
        members = udc.getDomain(source, dataSet, dimension),
        expectedMembers = _.range(1950, 2011).map(String);
    expect(members.length).toBe(expectedMembers.length);
    expectedMembers.forEach(function (year) {
      expect(members).toContain(year);
    });
  });

  it('should list members of the Space dimension', function () {
    var source = 'United Nations',
        dataSet = 'Population Estimates',
        dimension = 'Space',
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
    var source = 'United Nations',
        dataSet = 'Population Estimates',
        cell = {
          'Space': '900', /* World */
          'Time': '2010'
        },
        measure = 'Population',
        value = udc.getValue(source, dataSet, cell, measure);
    expect(value).toBe(6916183.482 * 1000);
  });

  // TODO test waitFor
});
