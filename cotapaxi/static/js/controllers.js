var cotopaxiApp = angular.module('cotopaxiApp', ['ngRoute']);

cotopaxiApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'static/partials/welcome.html',
        controller: 'CotopaxiCtrl'
      }).

      when('/sign-up', {
        templateUrl: 'static/partials/signup.html',
        controller: 'CotopaxiCtrl'
      }).
      when('/login', {
        templateUrl: 'static/partials/login.html',
        controller: 'CotopaxiCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

cotopaxiApp.controller('CotopaxiCtrl', function ($scope) {
 
});