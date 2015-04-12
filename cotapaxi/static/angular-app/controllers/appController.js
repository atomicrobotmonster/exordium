'use strict'

var appController = angular.module('cotopaxiApp').controller('AppController', function ($http, $location, $rootScope, $scope, UserAuthService, UserProfile) {
  $scope.isActive = function (viewLocation) {
    var active = (viewLocation === $location.path());
    return active;
  }

  $scope.logout = function() {
    console.log('Logging out ' + UserAuthService.getUserCredentials().username + '.')

    $rootScope.authenticated = false
    
    UserAuthService.clearCredentials()

    $location.path('/')
  }
})

appController.currentUserProfile = function($rootScope, UserAuthService, UserProfile) {
  $rootScope.authenticated = UserAuthService.isAuthenticated()

  if (UserAuthService.isAuthenticated()) {
    console.log('Retrieving user profile for  ' + UserAuthService.getUserCredentials().username + '.')
    
    return UserProfile.get().$promise
  }
}