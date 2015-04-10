'use strict'

angular.module('cotopaxiApp').controller('AppController', function ($http, $location, $scope, UserAuthService) {
  $scope.isActive = function (viewLocation) {
    var active = (viewLocation === $location.path());
    return active;
  }

  $scope.logout = function() {
    $scope.shared.authenticated = false
    $scope.shared.userProfile = null
    
    UserAuthService.clearCredentials()

    $location.path('/')
  }

  $scope.shared = { userProfile: null, authenticated: false}
})