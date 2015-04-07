var cotopaxiApp = angular.module('cotopaxiApp', ['ngRoute', 'cotopaxiUser']);

cotopaxiApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'static/angular-app/views/main.html',
        controller:  'CharacterEditorController'
      }).
      when('/new-character', {
        templateUrl: 'static/angular-app/views/main.html',
        controller:  'NewCharacterController'
      }).
      when('/character/:characterId', {
        templateUrl: 'static/angular-app/views/main.html',
        controller:  'CharacterEditorController'
      }).
      when('/sign-up', {
        templateUrl: 'static/angular-app/views/signup.html',
        controller:  'RegistrationController'
      }).
      when('/login', {
        templateUrl: 'static/angular-app/views/login.html',
        controller:  'LoginController'
      }).
      otherwise({
        redirectTo: '/'
      })
  }
])