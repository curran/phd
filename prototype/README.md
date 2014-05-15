A proof-of-concept implementation of the Universal Data Cube Visualization Framework.

 * [Run the prototype](http://curran.github.io/phd/prototype/)
 * [Run the unit tests](http://curran.github.io/phd/prototype/SpecRunner.html)
 * [View the documentation](http://curran.github.io/phd/prototype/docs/main.html)

Depends on the following JavaScript libraries:

 * [Require](http://requirejs.org/)
 * [Lodash](http://lodash.com/)
 * [Backbone](http://backbonejs.org/)
 * [D3](http://d3js.org/)

Prior art: reusable D3 visualizations

 * [Towards Reusable Charts](http://bost.ocks.org/mike/chart/)
 * [D3 Examples](https://github.com/mbostock/d3/wiki/Gallery)
 * [NVD3](http://nvd3.org/)
 * [Angular-nvD3](http://krispo.github.io/angular-nvd3/#/)
 * [DC.js](http://nickqizhu.github.io/dc.js/)
 * [Crossfilter.js](http://square.github.io/crossfilter/)
 * [reD3](http://bugzu.github.io/reD3/#/)
 * [dimple](http://dimplejs.org/)
 * [raw](http://app.raw.densitydesign.org/)

Related previous work:

 * [(2013) dashboardScaffold](https://github.com/curran/dashboardScaffold) (July 2013) - An open source visualization dashboard layout and dynamic configuration framework.
 * [(2012) A Web-based Data Cube Visualization Ecosystem Architecture](http://curran.github.com/portfolio/2012/A Web-based Data Cube Visualization Ecosystem Architecture.pdf) - Sketches of my doctoral dissertation, presented at the IEEE VisWeek 2012 Doctoral Colloquium.
 * [(2010) Universal Data Cube](http://curran.github.com/portfolio/2010/Universal Data Cube.pdf) - A report on my work on developing the "Universal Data Cube" concept at University of Konstanz.

Open source contributions and discussions resulting from this project:

 * [Backbone Mailing List - Improving the Backbone Model API with wire()](https://groups.google.com/forum/#!topic/backbonejs/CnFLHg-d0uk)
 * [StackOverflow Answer - count (non-blank) lines-of-code in bash](http://stackoverflow.com/questions/114814/count-non-blank-lines-of-code-in-bash)
 * [D3 Mailing List - How to position and size an SVG programmatically? (dynamic CSS not working)](https://groups.google.com/forum/#!topic/d3-js/x4Tz_O7wA3Q)
 * [StackOverflow Answer - How read data From *.CSV file using javascript?](http://stackoverflow.com/questions/7431268/how-read-data-from-csv-file-using-javascript/22850815#22850815)
 * [StackOverflow Answer - how to implement observer pattern in javascript?](http://stackoverflow.com/questions/12308246/how-to-implement-observer-pattern-in-javascript/22824844#22824844)

# The Plan

This `phd/prototype` directory contains a first pass of the entire framework, done to get a sense of how everything can fit together. However there are several components that should really be their own projects, and used together using a dependency management framework such as [Bower](http://bower.io/). The components are as follows:

 * [Model](https://github.com/curran/model) - a functional reactive model for creating reusable dynamic visualizations
 * [UDC](https://github.com/curran/udc) - the Universal Data Cube framework for data cube integration and query
 * Quadsimplify - a scale-based line simplification algorithm for fast zoomable choropleth maps
 * Boxes - a layout algorithm for nestex boxes
 * Visualizations - a collection of reusable visualization components
   * depends on Model
 * Overseer - manages application state as a collection of reactive models
   * depends on Model
 * Arranger - a text-based application state editor
   * depends on Overseer
 * Dashboard - manages configuration of dashboards with multiple linked views
   * depends on Boxes, Overseer, Configurator
 * UDC-Data - a collection of UDC data sets
   * depends on UDC
 * UDC-Vis - a collection of reusable visualizations for the UDC model
   * depends on UDC, Visualizations
 * Examples - a collection of self-contained examples
   * each having own bower.json
   * example viewer like bl.ocks.org
