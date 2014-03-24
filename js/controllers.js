var siteControllers;

siteControllers = angular.module('siteControllers', []);

siteControllers.controller('NavController', function ($scope, $http) {
	$http.get(api_url + '/?api_key=' + api_key).success(function(data) {
		$scope.data = data;
	});
});

siteControllers.controller('HomeController', function ($scope, $http, $rootScope) {
	$rootScope.title = site_name;
	$scope.statement = "Oh shit, writing one now... ";
	$http.get('http://hipsterjesus.com/api/?type=hipster-centric&paras=2').success(function(data) {
		$scope.statement = data.text;
	});
});


siteControllers.controller('GalleryDetailsController', function ($scope, $http, $routeParams, $rootScope) {
	$http.get(api_url + '/galleries/?api_key=' + api_key + "&id=" + $routeParams.galleryId).success(function(data) {
		$scope.data = data;
		$rootScope.title = site_name + " | Galleries / " + data[0].name;

	});
});

siteControllers.controller('TitleDetailsController', function ($scope, $http, $routeParams, $rootScope) {
	$http.get(api_url + '/titles/?api_key=' + api_key + "&id=" + $routeParams.titleId).success(function(data) {
		$scope.data = data;
		$rootScope.title = site_name + " | Comics / " + data[0].name;
	});
});


siteControllers.controller('FeedDetailsController', function ($scope, $http, $routeParams, $rootScope) {
	$http.get(api_url + '/feeds/?api_key=' + api_key + "&id=" + $routeParams.feedId + "&").success(function(data) {
		$scope.data = data;
		$rootScope.title = site_name + " | Blogs / " + data[0].name;
	});
});
