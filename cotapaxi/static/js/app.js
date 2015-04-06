var cotopaxiApp = angular.module('cotopaxiApp', ['ngRoute', 'ngResource']);

cotopaxiApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'static/partials/main.html',
      }).

      when('/sign-up', {
        templateUrl: 'static/partials/signup.html',
      }).
      when('/login', {
        templateUrl: 'static/partials/login.html'
      }).
      when('/editor', {
        templateUrl: 'static/partials/editor.html'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

cotopaxiApp.factory('UserProfile', function($resource) {
  return $resource('http://localhost:8000/api/userprofile/:userProfileId')  
});

cotopaxiApp.controller('UserController', function ($http, $location, $scope, UserProfile) {
  $scope.registration = new UserProfile
  $scope.registration.username = ''
  $scope.registration.first_name = ''
  $scope.registration.last_name = ''
  $scope.registration.email = ''
  $scope.registration.password = ''
  $scope.authenticated = false

  $scope.isActive = function (viewLocation) {
    var active = (viewLocation === $location.path());
    return active;
  }

  $scope.submitRegistration = function() {
    $scope.registration.$save()

    $http.defaults.headers.common['Authorization'] = 'Basic ' + $scope.registration.username + ':' + $scope.registration.password
    $scope.authenticated = true
    $location.path('/')
  }

  $scope.login = function() {
    /* FIXME crude, will apply to all HTTP requests */
    $http.defaults.headers.common['Authorization'] = 'Basic ' + $scope.username + ':' + $scope.password
    $scope.authenticated = true
    $location.path('/')
  }

  $scope.logout = function() {
    $scope.authenticated = false
    delete $http.defaults.headers.common['Authorization']

    $location.path('/')
  }

  $scope.getUserProfile = function() {
    $scope.userProfile = UserProfile.get( { userProfileId: 1 })  
  }

});