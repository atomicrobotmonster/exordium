'use strict'

angular.module('cotopaxiApp').controller('CharacterEditorController', function ($http, $location, $routeParams, $scope, UserProfile, Character) {
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

  $scope.saveCharacter = function() {
    if ($scope.currentCharacter.totalCharacterPoints() != 4) {
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