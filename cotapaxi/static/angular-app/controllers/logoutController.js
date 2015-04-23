var appController;

(function() {
	'use strict';

	appController = angular.module('cotopaxiApp').controller('LogoutController', function ($location, $rootScope, $scope, UserAuthService) {
	  console.log('Logging out ' + UserAuthService.getUserCredentials().username + '.');

	  $rootScope.authenticated = false;
	  
	  UserAuthService.clearCredentials();

	  $location.url('');
	});
}());