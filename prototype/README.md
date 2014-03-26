A proof-of-concept implementation of the Universal Data Cube Visualization Framework.

Depends on the following JavaScript libraries:

 * [Require](http://requirejs.org/)
 * [Lodash](http://lodash.com/)
 * [Backbone](http://backbonejs.org/)
 * [D3](http://d3js.org/)

The high-level organization of the framework has the following components:

 * dashboardScaffold - manages configuration of dashboards with multiple linked views
 * udc - implements the Universal Data Cube framework for data cube integration
 * visualizations - provides implementations of interactive visualizations based on the udc API

Prior art: reusable D3 visualizations

 * [Towards Reusable Charts](http://bost.ocks.org/mike/chart/)
 * [D3 Examples](https://github.com/mbostock/d3/wiki/Gallery)
 * [NVD3](http://nvd3.org/)
 * [DC](http://nickqizhu.github.io/dc.js/)
 * [reD3](http://bugzu.github.io/reD3/#/)
