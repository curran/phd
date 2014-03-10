// A presentation framework using Angular.js.
//
// Slides are authored in Markdown.
//
// Presentation configuration resides in `presentation.json`,
// which specifies the presentation title and the ordering of slides.
//
// Curran Kelleher 3/10/2014

// Declare the Angular app.
var app = angular.module('app', ['ngRoute']);

// Configure routes.
app.config(function($routeProvider){
  $routeProvider.
    when('/:slideName', {
      // `slideHTML` is compiled from the Markdown file for each slide.
      template: '<div ng-bind-html="slideHTML" class="slide"></div>',
      controller: 'SlideCtrl'
    }).
    otherwise({ redirectTo: '/firstSlide' });
});

// This controller is attached to the <body>, and deals with:
//
//  * loading the presentation metadata from `slides.json`
//  * handling the arrow keys to change slides
//  * exposing the `currentSlide` function used for styling the active slide
app.controller('PresentationCtrl', function($scope, $http, $document, $location){

  // Key codes for arrow keys.
  var LEFT = 37, RIGHT = 39;

  // Get the presentation configuration that lives in "presentation.json".
  $http.get('/presentation.json').success(function(presentation){

    // Make a local var for concise reference later.
    var slides = presentation.slides;

    // Add indices to the slides for use in nextSlide() and previousSlide().
    slides.forEach(function(slide, index){
      slide.index = index;
    });

    // Used to set the <title> of the page.
    $scope.title = presentation.title;

    // Used for creating the list of slides on the left.
    $scope.slides = slides;

    // Used to determine which slide entry should be styled as "active".
    $scope.currentSlide = currentSlide;

    // Navigates to the previous or next slide.
    // Called on key down event of the <body> element.
    $scope.changeSlide = changeSlide;

    function changeSlide(arrow) {
      if(arrow === RIGHT){
        navigateTo(nextSlide());
      } else if(arrow === LEFT){
        navigateTo(previousSlide());
      }      
    }

    // Navigates to the given slide
    // by changing the URL hash fragment.
    function navigateTo(slide) {
      $location.path('/' + slide.name);
    }

    function nextSlide(){
      var i = currentSlide().index;
      return slides[i < slides.length - 1 ? i + 1 : i];
    }

    function previousSlide(){
      var i = currentSlide().index;
      return slides[i > 0 ? i - 1 : i];
    }

    // Returns the current slide based on the
    // current URL hash fragment.
    function currentSlide(){
      return _.findWhere(slides, {
        name: $location.path().substr(1)
      });
    }
  });
});

// Used by the router for rendering slide content.
// Loads and renders each slide in response to URL changes.
app.controller('SlideCtrl', function($scope, $routeParams, $http, $sce){

  // Compute the path of the markdown file from the slide name.
  var markdownFile = 'slides/' + $routeParams.slideName + '.md';

  // Fetch the Markdown file that contains the content for the current slide.
  $http.get(markdownFile).success(function(markdownText){

    // Compile the markdown text using the marked.js library.
    // See https://github.com/chjj/marked
    var slideHTML = marked(markdownText);

    // Use of $sce is required because ng-bind-html is used in the template.
    // For more info, see:
    //   http://docs.angularjs.org/api/ng/directive/ngBindHtml
    //   http://docs.angularjs.org/api/ng/service/$sce
    $scope.slideHTML = $sce.trustAsHtml(slideHTML);
  });
});
