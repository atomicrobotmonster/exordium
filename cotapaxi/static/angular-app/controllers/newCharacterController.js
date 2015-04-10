'use strict';

angular.module('cotopaxiApp').controller('NewCharacterController', function ($http, $location, $scope, UserProfile, Character) {
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

