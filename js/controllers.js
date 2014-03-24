var siteControllers;

siteControllers = angular.module('siteControllers', []);

siteControllers.controller('NavController', function ($scope, $http) {
	$http.get(api_url + '/?api_key=' + api_key).success(function(data) {
		$scope.data = data;
	});
});

siteControllers.controller('HomeController', function ($scope, $http, $rootScope) {
	$rootScope.title = site_name;
});


siteControllers.controller('GalleryDetailsController', function ($scope, $http, $routeParams, $rootScope) {
	//console.log($rootScope);
	$http.get(api_url + '/galleries/?api_key=' + api_key + "&id=" + $routeParams.galleryId).success(function(data) {
		$(data[0].contents).each(function(i,content){
			//console.log(content.image_url);
			thumbnail_url = $.url('protocol', content.image_url) + 
							"://" +
							$.url('sub', content.image_url) + 
							"." + 
							$.url('domain', content.image_url) + 
							"/w160-h160" + 
							$.url('path', content.image_url);
			//console.log(thumbnail_url);
			data[0].contents[i].thumbnail_url = thumbnail_url;
		});
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

		$.ajax({
		  url      : document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(data[0].rss_url),
		  dataType : 'json',
		  success  : function (data) {
		  	$scope.entries = data;
		    /*if (data.responseData.feed && data.responseData.feed.entries) {
		      $.each(data.responseData.feed.entries, function (i, e) {
		        console.log("------------------------");
		        console.log("title      : " + e.title);
		        console.log("author     : " + e.author);
		        console.log("description: " + e.description);
		      });
		    }*/
		  }
		});


		$rootScope.title = site_name + " | Blogs / " + data[0].name;
	});
});
