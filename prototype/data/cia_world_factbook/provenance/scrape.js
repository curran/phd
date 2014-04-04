// A PhantomJS script that scrapes up-to-date data
// from the CIA World Factbook site.
//
// Run with "phantomjs scrape.js"
//
// Draws from:
//
//  * http://techslides.com/grabbing-html-source-code-with-phantomjs-or-casperjs/
//  * http://techslides.com/demos/d3/cia-data/c-scrape.js
//  * http://stackoverflow.com/questions/7531601/using-phantom-js-to-convert-all-html-files-in-a-folder-to-png
//  * https://developer.mozilla.org/en-US/docs/Traversing_an_HTML_table_with_JavaScript_and_DOM_Interfaces
//
// By Curran Kelleher 4/3/2014

var fs = require('fs'),
    fieldsDir = fs.workingDirectory + '/fields',
    page = require('webpage').create(),
    raw = {};

// Use only pages that start with "print",
// because the page structure is simple.
var pageNames = (fs.list(fieldsDir).filter(function(name){
  return name.substr(0, 5) == 'print';
}));

// Supress errors
page.onError = function(msg, trace) { };

function loadPage(i){
  var fullPath = fieldsDir + '/' + pageNames[i];
  page.open(fullPath, function (status){
    var data = page.evaluate(function () {
      return {
        fieldName: [].map.call(document.querySelectorAll('th'), function(el){
            return el.innerText;
          })[1],
        entries: [].map.call(document.querySelectorAll('table'), function(el){
            return el;
          }).filter( function (el) {
            return el.id.length == 2;
          }).map(function (el) {
            return {
              country: el.querySelector('.fl_region a').innerText,
              value: el.querySelector('.category_data').innerText
            };
          })
      };
    });

    console.log('Scraped ' + data.fieldName)
    raw[data.fieldName] = data.entries;

    if(i < pageNames.length - 1) {
      loadPage(i + 1);
    } else {
      console.log('Done scraping! Writing file raw.json');
      fs.write(fs.workingDirectory + '/raw.json', JSON.stringify(raw, null, 2), 'w');
      phantom.exit();
    }
  });
}

loadPage(0);
