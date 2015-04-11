'use strict'

angular.module('cotopaxiApp').service('UserAuthService', function() {
  var service = this;  
  var credentials = null

  service.getUserCredentials = function() {
    return credentials;
  }

  service.isAuthenticated = function() {
    return credentials != null;
  }

  service.registerCredentials = function(username, password) {
    credentials = {
      'username': username,
      'password': password }
    console.log('Credentials registered.')
  }

  service.clearCredentials = function() {
    credentials = null
    console.log('Credentials cleared.')
  }
})