// A simple presentation framework using Angular.js.
//
// Curran Kelleher 2/26/2014
//
// Draws from Angular screencast:
// https://www.youtube.com/watch?v=8ILQOFAgaXE

// Declare the Angular app.
var app = angular.module('app', ['ngRoute']);

// Configure routes.
app.config(function($routeProvider){
  $routeProvider.
    when('/:slideName', {
      // `slideHTML` is compiled from the Markdown file for each slide.
      template: '<div ng-bind-html="slideHTML" class="split-right"></div>',
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

    // Add indices to the slides for use in nextSlide() and previousSlide().
    presentation.slides.forEach(function(slide, index){
      slide.index = index;
    });

    // Used to set the <title> of the page.
    $scope.title = presentation.title;

    // Used for creating the list of slides on the left.
    $scope.slides = presentation.slides;

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
    };

    // Returns the current slide based on the URL hash.
    function currentSlide(){
      return _.findWhere(presentation.slides, {
        name: $location.path().substr(1)
      });
    };

    function nextSlide(){
      // TODO bounds check
      var i = currentSlide().index + 1;
      return $scope.slides[i];
    }

    function previousSlide(){
      // TODO bounds check
      var i = currentSlide().index - 1;
      return $scope.slides[i];
    }

    // Navigates to the given slide
    // by changing the URL hash fragment.
    function navigateTo(slide) {
      $location.path('/' + slide.name);
    }

  });
});

// Used by the router.
// Loads each slide in response to URL changes.
app.controller('SlideCtrl', function($scope, $routeParams, $http, $sce){

  // Compute the path of the markdown file from the slide name.
  var markdownFile = 'slides/' + $routeParams.slideName + '.md';

  // Fetch the Markdown file that contains the content for the current slide.
  $http.get(markdownFile).success(function(md){

    // Compile the markdown text using the marked.js library.
    // See https://github.com/chjj/marked
    var slideHTML = marked(md);

    // Use of $sce is required because ng-bind-html is used in the template.
    // For more info, see:
    //   http://docs.angularjs.org/api/ng/directive/ngBindHtml
    //   http://docs.angularjs.org/api/ng/service/$sce
    $scope.slideHTML = $sce.trustAsHtml(slideHTML);
  });
});
