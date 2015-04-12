'use strict';

var cotopaxiApp = angular.module('cotopaxiApp', ['ngRoute', 'ngResource']);

cotopaxiApp.config(['$routeProvider', '$httpProvider', 
  function ($routeProvider, $httpProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'static/angular-app/views/main.html',
        controller:  'CharacterEditorController',
        resolve: {
          currentUserProfile: appController.currentUserProfile
        }
      }).
      when('/new-character', {
        templateUrl: 'static/angular-app/views/main.html',
        controller:  'NewCharacterController',
        resolve: {
          currentUserProfile: appController.currentUserProfile
        }
      }).
      when('/character/:characterId', {
        templateUrl: 'static/angular-app/views/main.html',
        controller:  'CharacterEditorController',
        resolve: {
          currentUserProfile: appController.currentUserProfile
        }
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
 
      $httpProvider.interceptors.push('APIAuthInterceptor')
  }
])

cotopaxiApp.run(function($rootScope, $location, UserAuthService) {

  $rootScope.authenticated = UserAuthService.loadStoredCredentials()

  $rootScope.$on('$routeChangeStart', function(event, next, current) {

      if (next.originalPath) {
      var openPaths = [
        '/',
        '',
        '/sign-up',
        '/login-']

      var authenticated = UserAuthService.isAuthenticated()
      var openPath = openPaths.indexOf(next.originalPath) > -1

      console.log((authenticated ? 'Authenticated' : 'Unauthenticated') + ' user is attempting to navigate to ' + (openPath ? 'open' : 'protected') +' URL: ' + next.originalPath)

      if (!authenticated && !openPath) {
        console.log('Redirecting unauthenticated user to login.')
        $location.path('/login');
        return
      }
    }
  })

})