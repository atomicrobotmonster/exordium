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
      otherwise({
        redirectTo: '/'
      })
  }])

cotopaxiApp.factory('Registration', function($resource) {
  return $resource('http://localhost:8000/api/userprofile')  
})

cotopaxiApp.factory('UserProfile', function($resource) {
  return $resource('http://localhost:8000/api/current-user')  
})

cotopaxiApp.factory('Character', function($resource) {
  return $resource('http://localhost:8000/api/character/:id', null, {
    'update': { method:'PUT', params: {id:'@id'} }
  }) 
})

cotopaxiApp.controller('UserController', function ($http, $location, $scope, Registration, UserProfile, Character) {
  $scope.$on('$routeChangeSuccess', function () {
    $scope.badCredentials = false
    $scope.authentication.password = ''
  });

  $scope.isActive = function (viewLocation) {
    var active = (viewLocation === $location.path());
    return active;
  }

  $scope.isEditing = function (characterId) {
    return characterId === $scope.currentCharacter.id;
  }

  function handleHttpError(error) {
    if (error.status == 401) {    
      $scope.badCredentials = true
      $scope.authentication.password = ''
    } else {
      console.log("The API returned an error: status [" + error.status + "] statusText [" + error.statusText + "]")
    }
  }

  function refreshUserProfile(preferredIdInList) {
    $scope.userProfile = UserProfile.get(function(data) {
      $scope.authenticated = true
      $scope.badCredentials = false

      if (data.characters.length == 0) {
        $scope.newCharacter()
      } else {
        var idToSelect
        if (preferredIdInList) {
          idToSelect = preferredIdInList
        } else {
          idToSelect = data.characters.sort(function(a, b) {
            var x = a['name']; var y = b['name']
            return ((x < y) ? -1 : ((x > y) ? 1 : 0))
          })[0].id
        }
        $scope.selectCharacter(idToSelect)
      }
      $location.path('/')
    }, handleHttpError)
  }

  $scope.submitRegistration = function() {
    $scope.registration.$save(function(data) {
      $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa($scope.registration.username + ':' + $scope.registration.password)
      refreshUserProfile()
    })

  }

  $scope.login = function() {
    /* FIXME crude, will apply to all HTTP requests */
    $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa($scope.authentication.username + ':' + $scope.authentication.password)
    refreshUserProfile()
  }

  $scope.logout = function() {
    $scope.authenticated = false
    delete $http.defaults.headers.common['Authorization']

    $location.path('/')
  }

  $scope.selectCharacter = function(characterId) {
    $scope.showNewCharacterLink = false
    $scope.badAttributePoints = false
    $scope.currentCharacter = Character.get({ 'id': characterId })
  }

  function totalCharacterPoints(character) {
    return character.unassigned_attribute_points 
      + character.strength 
      + character.agility
      + character.mind
      + character.appeal
  }

  $scope.saveCharacter = function() {
    if (totalCharacterPoints($scope.currentCharacter) != 4) {
      $scope.badAttributePoints = true
      return
    } else {
      $scope.badAttributePoints = false
    }

    if (!$scope.currentCharacter.id) {
      $scope.currentCharacter.$save(function(data) {
        refreshUserProfile(data.id)
      })      
    } else {
      $scope.currentCharacter.$update(function(data) {
        refreshUserProfile($scope.currentCharacter.id)
      })
    }
  }

  $scope.deleteCharacter = function(id) {
    $scope.currentCharacter.$remove({id: id}, function(data) {
      refreshUserProfile()
    })
  }

  $scope.newCharacter = function() {
    $scope.showNewCharacterLink = true
    $scope.badAttributePoints = false
    $scope.currentCharacter = new Character
    $scope.currentCharacter.id = null
    $scope.currentCharacter.name = 'Unknown Wanderer'
    $scope.currentCharacter.unassigned_attribute_points = 4
    $scope.currentCharacter.strength = 0
    $scope.currentCharacter.agility = 0
    $scope.currentCharacter.mind = 0
    $scope.currentCharacter.appeal = 0
    $scope.currentCharacter.user_profile = $scope.userProfile.id
  }

  $scope.showNewCharacterLink = false
  $scope.badCredentials = false;
  $scope.registration = new Registration
  $scope.registration.username = ''
  $scope.registration.first_name = ''
  $scope.registration.last_name = ''
  $scope.registration.email = ''
  $scope.registration.password = ''
  $scope.authenticated = false
  $scope.authentication = { username: '', password: ''}
})