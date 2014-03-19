var phonecatApp = angular.module('phonecatApp', []);
 
phonecatApp.controller('PhoneListCtrl', function ($scope, $http) {
 $http.get('http://dev.artistcontrolbox.com/api/galleries/?api_key=c4ca4238a0b923820dcc509a6f75849b').success(function(data) {
   $scope.phones = data;
 });
});
