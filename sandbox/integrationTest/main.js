/**
 * This script implments a hard-coded data integration example.
 *
 * The data integration operations here should be generalized.
 *
 * Curran Kelleher 2/26/2013
 */

// Fetch the input files
// TODO use promoses
d3.json('hierarchy.json', function(hierarchy) {
  d3.json('countryPopulations.json', function(countryPopulations) {
    d3.json('countryCodes.json', function(countryCodes) {
      d3.json('statePopulations.json', function(statePopulations) {
        integrate(hierarchy, countryPopulations, statePopulations, countryCodes);
      });
    });
  });
});

function integrate(hierarchy, countryPopulations, statePopulations, countryCodes){

  // Keys: country or state names
  // Values: population
  var populationByRegion = {},

      // Keys: country codes
      // Values: country names
      countryByCode = {};

  // Store the state populations.
  // Keys and scale already match target.
  statePopulations.forEach(function(entry){
    populationByRegion[entry.State] = entry.Population;
  });

  // Extract the country code to name mapping.
  countryCodes.forEach(function(entry){
    countryByCode[entry.Code] = entry.Country;
  });

  // Use the country code to name mapping to store
  // population values by country name.
  // Scale population by 1000000000.
  countryPopulations.forEach(function(entry){
    var country = countryByCode[entry.Country];
    populationByRegion[country] = entry.Population * 1000000000;
  });
  
  // Add the population values to nodes in the hierarchy.
  function traverse(node) {
    var population = populationByRegion[node.name];
    if(population){
      node.population = population;
    }
    if(node.children) {
      node.children.forEach(traverse);
    }
  }
  traverse(hierarchy);

  console.log(JSON.stringify(hierarchy, null, 2));
}
