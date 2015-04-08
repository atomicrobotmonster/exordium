var cotopaxiUser = angular.module("cotopaxiUser", ['ngResource'])

cotopaxiUser.factory('Registration', function($resource) {
  return $resource('http://localhost:8000/api/userprofile')  
})

cotopaxiUser.factory('UserProfile', function($resource) {
  return $resource('http://localhost:8000/api/current-user')  
})

cotopaxiUser.factory('Character', function($resource) {
  return $resource('http://localhost:8000/api/character/:id', null, {
    'update': { method:'PUT', params: {id:'@id'} }
  }) 
})

cotopaxiUser.controller('AppController', function ($http, $location, $scope) {
  $scope.isActive = function (viewLocation) {
    var active = (viewLocation === $location.path());
    return active;
  }

  $scope.logout = function() {
    $scope.shared.authenticated = false
    $scope.shared.userProfile = null
    delete $http.defaults.headers.common['Authorization']

    $location.path('/')
  }

  $scope.shared = { userProfile: null, authenticated: false}
})

cotopaxiUser.controller('LoginController', function ($http, $location, $scope, UserProfile) {

  function handleHttpError(error) {
    if (error.status == 401) {    
      $scope.badCredentials = true
      $scope.authentication.password = ''
    } else {
      console.log("The API returned an error: status [" + error.status + "] statusText [" + error.statusText + "]")
    }
  }

  $scope.login = function() {
    /* FIXME crude, will apply to all HTTP requests */
    $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa($scope.authentication.username + ':' + $scope.authentication.password)
    
    $scope.shared.userProfile = UserProfile.get(function(data) {
      $scope.shared.authenticated = true
      $location.path('/')
    }, handleHttpError)
  }

  $scope.badCredentials = false;
  $scope.shared.authenticated = false
})

cotopaxiUser.controller('RegistrationController', function ($http, $location, $scope, Registration, UserProfile) {

  function handleHttpError(error) {
    if (error.status == 401) {    
      $scope.badCredentials = true
      $scope.authentication.password = ''
    } else {
      console.log("The API returned an error: status [" + error.status + "] statusText [" + error.statusText + "]")
    }
  }

  $scope.submitRegistration = function() {
    var username = $scope.registration.username
    var password = $scope.registration.password

    $scope.registration.$save(function(data) {
      $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa(username + ':' + password)
      
      $scope.shared.userProfile = UserProfile.get(function(data) {
        $scope.shared.authenticated = true
        $location.path('/')        
      })
    })
  }

  $scope.registration = new Registration
  $scope.registration.username = ''
  $scope.registration.first_name = ''
  $scope.registration.last_name = ''
  $scope.registration.email = ''
  $scope.registration.password = ''
})

cotopaxiUser.controller('CharacterEditorController', function ($http, $location, $routeParams, $scope, UserProfile, Character) {
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

    $scope.currentCharacter.$update(function(data) {
      $scope.shared.userProfile = UserProfile.get(function(userProfile) {
        $location.path("/character/" + $scope.currentCharacter.id)
      })
    })
  }

  $scope.deleteCharacter = function(id) {
    $scope.currentCharacter.$remove({id: id}, function(data) {
      $scope.shared.userProfile = UserProfile.get(function(userProfile) {
        $location.path("/character")
      })
    })
  }

  //TODO lame... should be able to handle this in route...
  if (!$scope.shared.authenticated && $location.path().indexOf("/character") != -1) {
    $location.path("/login")
    return
  }


  $scope.showNewCharacterLink = false
  
  var idToSelect = null
  if ($scope.shared.userProfile) {  
    if ($scope.shared.userProfile.characters.length == 0) {
      $location.path('/new-character')
      return
    } else if ($routeParams.characterId) {
      idToSelect = $routeParams.characterId
    } else {
      idToSelect = $scope.shared.userProfile.characters.sort(function(a, b) {
        var x = a['name']; var y = b['name']
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })[0].id
    }

    $scope.showNewCharacterLink = false
    $scope.badAttributePoints = false
    $scope.currentCharacter = Character.get({ 'id': idToSelect })
  }
})

cotopaxiUser.controller('NewCharacterController', function ($http, $location, $scope, UserProfile, Character) {
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

    $scope.currentCharacter.$save(function(savedCharacter) {
      $scope.shared.userProfile = UserProfile.get(function(userProfile) {
        $location.path("/character/" + savedCharacter.id)
      })
    })      
  }

  //TODO lame... should be able to handle this in route...
  if (!$scope.shared.authenticated) {
    $location.path("/login")
    return
  }

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
  $scope.currentCharacter.user_profile = $scope.shared.userProfile.id
})

