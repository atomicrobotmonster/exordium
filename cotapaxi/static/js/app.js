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
  return $resource('http://localhost:8000/api/current-user')  
});

cotopaxiApp.controller('UserController', function ($http, $location, $scope, UserProfile) {
  $scope.$on('$routeChangeSuccess', function () {
    $scope.badCredentials = false
    $scope.authentication.password = ''
  });

  $scope.isActive = function (viewLocation) {
    var active = (viewLocation === $location.path());
    return active;
  }

  function handleHttpError(error) {
    if (error.status == 401) {    
      $scope.badCredentials = true
      $scope.authentication.password = ''
    } else {
      console.log("The API returned an error: status [" + error.status + "] statusText [" + error.statusText + "]")
    }
  }

  $scope.submitRegistration = function() {
    $scope.registration.$save()

    $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa($scope.registration.username + ':' + $scope.registration.password)
    $scope.authenticated = true
    $scope.badCredentials = false
    $location.path('/')
  }

  $scope.login = function() {
    /* FIXME crude, will apply to all HTTP requests */
    $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa($scope.authentication.username + ':' + $scope.authentication.password)
  
    $scope.userProfile = UserProfile.get(function(data) {
      $scope.authenticated = true
      $scope.badCredentials = false
      $location.path('/')
    }, handleHttpError)
  }

  $scope.logout = function() {
    $scope.authenticated = false
    delete $http.defaults.headers.common['Authorization']

    $location.path('/')
  }

  $scope.newCharacter = function() {
    $scope.currentCharacter = {
      name: 'Unknown Wanderer',
      unassigned_attribute_points: 4,
      strength: 0,
      agility: 0,
      mind: 0,
      appeal: 0
    }
  }

  $scope.selectCharacter = function(index) {
    $scope.currentCharacter = $scope.characters[index]
  }

  $scope.saveCharacter = function() {
    alert('Saving...')
  }

  $scope.badCredentials = false;
  $scope.registration = new UserProfile
  $scope.registration.username = ''
  $scope.registration.first_name = ''
  $scope.registration.last_name = ''
  $scope.registration.email = ''
  $scope.registration.password = ''
  $scope.authenticated = false
  $scope.authentication = { username: '', password: ''}

  $scope.characters = [{ name: 'Kahlen' }, { name: 'Maknar'} ] 
  if ($scope.characters.length > 0) {
    $scope.selectCharacter(0)
  } 
});