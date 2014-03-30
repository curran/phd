A proof-of-concept implementation of the Universal Data Cube Visualization Framework.

 * [Run the prototype](http://curran.github.io/phd/prototype/)
 * [Run the unit tests](http://curran.github.io/phd/prototype/SpecRunner.html)
 * [View the documentation](http://curran.github.io/phd/prototype/docs/main.html)

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

Related previous work:

 * [(2013) dashboardScaffold](https://github.com/curran/dashboardScaffold) (July 2013) - An open source visualization dashboard layout and dynamic configuration framework. Developed while interning at Rapid7 creating cybersecurity visualization visualization dashboards with multiple linked views.
 * [(2012) A Web-based Data Cube Visualization Ecosystem Architecture](http://curran.github.com/portfolio/2012/A Web-based Data Cube Visualization Ecosystem Architecture.pdf) - Sketches of my doctoral dissertation, presented at the IEEE VisWeek 2012 Doctoral Colloquium.
 * [(2010) Universal Data Cube](http://curran.github.com/portfolio/2010/Universal Data Cube.pdf) - A report on my work on developing the "Universal Data Cube" concept at University of Konstanz.
