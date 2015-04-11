'use strict'

angular.module('cotopaxiApp').controller('LoginController', function ($http, $location, $rootScope, $scope, UserProfile, UserAuthService) {

  function handleHttpError(error) {
    if (error.status == 401) {    
      $scope.badCredentials = true
      $scope.authentication.password = ''
    } else {
      console.log("The API returned an error: status [" + error.status + "] statusText [" + error.statusText + "]")
    }
  }

  $scope.login = function() {    
    UserAuthService.registerCredentials($scope.authentication.username, $scope.authentication.password)

    $rootScope.shared.userProfile = UserProfile.get(function(data) {
      $rootScope.shared.authenticated = true
      $location.path('/')
    }, handleHttpError)
  }

  $scope.badCredentials = false;
  $rootScope.shared.authenticated = false
})