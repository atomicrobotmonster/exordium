var cotopaxiApp = angular.module('cotopaxiApp', ['ngRoute', 'cotopaxiUser']);

cotopaxiApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'static/angular-app/views/main.html',
      }).

      when('/sign-up', {
        templateUrl: 'static/angular-app/views/signup.html',
      }).
      when('/login', {
        templateUrl: 'static/angular-app/views/login.html'
      }).
      otherwise({
        redirectTo: '/'
      })
  }])
