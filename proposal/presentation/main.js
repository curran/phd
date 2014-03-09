// A simple presentation framework using Angular.js.
//
// Curran Kelleher 2/26/2014
//
// Draws from Angular screencast:
// https://www.youtube.com/watch?v=8ILQOFAgaXE

// Declare the Angular app.
var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider){

  $routeProvider.
    when('/:slideName', {
      template: '<div ng-bind-html="slideHTML" class="split-right"></div>',
      controller: 'SlideCtrl'
    }).
    otherwise({ redirectTo: '/firstSlide' });
});

app.controller('PresentationCtrl', function($scope, $http, $document, $location){

  // Key codes for arrow keys.
  var LEFT = 37, RIGHT = 39;

  // Get the presentation configuration that lives in "presentation.json".
  $http.get('/presentation.json').success(function(presentation){

    // Add indices to the slides
    presentation.slides.forEach(function(slide, index){
      slide.index = index;
    });

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

    function navigateTo(slide) {
      $location.path('/' + slide.name);
    }

    // Navigate to the previous or next slide.
    // Called on key down event of the <body> element.
    $scope.changeSlide = function(arrow) {
      if(arrow === RIGHT){
        navigateTo(nextSlide());
      } else if(arrow === LEFT){
        navigateTo(previousSlide());
      }      
    };

    $scope.title = presentation.title;

    // Used for creating the list of slides on the left.
    $scope.slides = presentation.slides;

    // This must be on the $scope because it is used
    // to determine which slide entry is "active".
    $scope.currentSlide = currentSlide;

  });
});

app.controller('SlideCtrl', function($scope, $routeParams, $http, $sce){
  var markdownFile = 'slides/' + $routeParams.slideName + '.md';
  $http.get(markdownFile).success(function(md){
    $scope.slideHTML = $sce.trustAsHtml(marked(md));
  });
});
