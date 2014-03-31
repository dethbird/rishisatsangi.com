var api_key, api_url;
api_key = "c4ca4238a0b923820dcc509a6f75849b";
api_url = "http://artistcontrolbox.com/api";
site_name = "RishiSatsangi.com";

var siteApp;

siteApp = angular.module('siteApp', [
  'ngRoute',
  'siteControllers'
]);

siteApp.filter('resizeImage', function(){
    return function(url,width,height) {
        return $.url('protocol', url) + 
              "://" +
              $.url('sub', url) + 
              "." + 
              $.url('domain', url) + 
              "/w" + width + "-h" + height + 
              $.url('path', url);
    }
});

siteApp.filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);


siteApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/galleries/:galleryId', {
        templateUrl: 'partials/gallery-details.html',
        controller: 'GalleryDetailsController'
      }).
      when('/comics/:titleId', {
        templateUrl: 'partials/title-details.html',
        controller: 'TitleDetailsController'
      }).
      when('/issues/:issueId', {
        templateUrl: 'partials/issue-details.html',
        controller: 'IssueDetailsController'
      }).
      when('/blogs/:feedId', {
        templateUrl: 'partials/feed-details.html',
        controller: 'FeedDetailsController'
      }).
      when('/contents/:contentId', {
        templateUrl: 'partials/content-details.html',
        controller: 'ContentDetailsController'
      }).
      otherwise({
        redirectTo: '/home',
        templateUrl: 'partials/home.html',
        controller: 'HomeController'
      });
  }]);
