// The entry point for the UDC visualization prototype.
//
// Curran Kelleher 3/26/2014
require(['dashboardScaffold'], function (DashboardScaffold) {

  // Create an empty dashboard.
  var dashboardDivId = 'dashboard',
      dashboard = DashboardScaffold(dashboardDivId);

  // Load the dashboard configuration.
  d3.json('dashboardConfig.json', dashboard.setConfig);
});
