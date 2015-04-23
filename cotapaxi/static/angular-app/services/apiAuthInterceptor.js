(function() {
	'use strict';

	angular.module('cotopaxiApp').service('APIAuthInterceptor', function($rootScope, UserAuthService) {
	  var service = this;

	  service.request = function(config) { 
	      var credentials = UserAuthService.getUserCredentials();

	      if (credentials) {
	        console.log('Credentials found.');
	        config.headers.Authorization = 'Basic ' + btoa(credentials.username  + ':' + credentials.password );
	      }
	      return config;
	  };
	});
}());