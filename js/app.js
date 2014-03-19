var api_key, api_url;
api_key = "c4ca4238a0b923820dcc509a6f75849b";
api_url = "http://artistcontrolbox.com/api";

var siteApp;

siteApp = angular.module('siteApp', [
  'ngRoute',
  'siteControllers'
]);
 
siteApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/galleries', {
        templateUrl: 'partials/gallery-list.html',
        controller: 'GalleriesController'
      }).
      when('/galleries/:galleryId', {
        templateUrl: 'partials/gallery-details.html',
        controller: 'GalleryDetailsController'
      }).
      otherwise({
        redirectTo: '/home',
        templateUrl: 'partials/home.html'
      });
  }]);
