'use strict'

var appController = angular.module('cotopaxiApp').controller('AppController', function ($http, $location, $rootScope, $scope, UserAuthService, UserProfile) {
  $scope.isActive = function (viewLocation) {
    var active = (viewLocation === $location.path());
    return active;
  }

  $scope.logout = function() {
    console.log('Logging out ' + UserAuthService.getUserCredentials().username + '.')

    $rootScope.shared.authenticated = false
    
    UserAuthService.clearCredentials()

    $location.path('/')
  }

  /* we need to declare shared in this parent controller first 
    or the controllers with child scopes will have their own values */
  $rootScope.shared = {
      authenticated: false
  }

})

appController.currentUserProfile = function($rootScope, UserAuthService, UserProfile) {
  console.log('RESOLVING CURRENT USER PROFILE')

  $rootScope.shared.authenticated = UserAuthService.isAuthenticated()

  if (UserAuthService.isAuthenticated()) {
    return UserProfile.get().$promise
  }
}