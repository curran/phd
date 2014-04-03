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
//
// By Curran Kelleher 4/2/2014

// Prefixes for country profile pages,
// extracted from the directory listing in the downloaded factbook
// from https://www.cia.gov/library/publications/download/

var fs = require('fs'),
    fieldsDir = fs.workingDirectory + '/fields',
    page = require('webpage').create();

var pageNames = (fs.list(fieldsDir).filter(function(name){
  return name.substr(0, 5) == 'print';
}));

// Supress errors
page.onError = function(msg, trace) { };

function loadPage(i){
  var fullPath = fieldsDir + '/' + pageNames[i];
  page.open(fullPath, function (status){
    var fieldName = page.evaluate(function () {
      var fieldName = [].map.call(document.querySelectorAll('th'), function(el){
        return el.innerText;
      })[1];

      // Return field name
      return fieldName;
      //return Array.prototype.slice.call(document.querySelectorAll('.category a')).map(function(el){
      //  return {
      //    category: el.firstChild.data.trim()
      //  };
      //});
    });

    console.log("'" + fieldName + "': null, /* " + pageNames[i] + " */");

    if(i < pageNames.length - 1) {
      //setTimeout(function(){
      loadPage(i + 1);
      //}, 1500);
    } else {
      phantom.exit();
    }
  });
}

loadPage(0);
 
//page.open(url, function (status) {
//    var js = page.evaluate(function () {
//      return [].map.call(document.querySelectorAll('a'), function(el){
//        return Math.random();
//      });
//      //return Array.prototype.slice.call(document.querySelectorAll('.category a')).map(function(el){
//      //  return {
//      //    category: el.firstChild.data.trim()
//      //  };
//      //});
//    });
//    console.log(JSON.stringify(js)); 
//});

