(function() {
  'use strict';

  angular.module('cotopaxiApp').service('UserAuthService', function($window) {
    var service = this;  
    var credentials = null;

    service.getUserCredentials = function() {
      return credentials;
    };

    service.isAuthenticated = function() {
      return credentials !== null;
    };

    service.loadStoredCredentials = function() {
      if ($window.sessionStorage.userCredentials) {
        credentials = JSON.parse($window.sessionStorage.userCredentials);
        return true;
      } else {
        return false;
      }
    };

    service.registerCredentials = function(username, password) {
      credentials = {
        'username': username,
        'password': password };

     $window.sessionStorage.userCredentials = JSON.stringify(credentials);

      console.log('Credentials registered.');
    };

    service.clearCredentials = function() {
      credentials = null;

       $window.sessionStorage.userCredentials = null;

      console.log('Credentials cleared.');
    };
  });
}());