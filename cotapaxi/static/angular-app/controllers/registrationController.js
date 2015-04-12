'use strict'

angular.module('cotopaxiApp').controller('RegistrationController', function ($http, $location, $rootScope, $scope, Registration, UserProfile, UserAuthService) {

  function handleHttpError(error) {
    if (error.status == 401) {    
      $scope.badCredentials = true
      $scope.authentication.password = ''
    } else {
      console.log("The API returned an error: status [" + error.status + "] statusText [" + error.statusText + "]")
    }
  }

  $scope.submitRegistration = function() {
  }

  $scope.registration = new Registration
  $scope.registration.username = ''
  $scope.registration.first_name = ''
  $scope.registration.last_name = ''
  $scope.registration.email = ''
  $scope.registration.password = ''
})