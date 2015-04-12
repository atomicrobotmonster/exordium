'use strict';

angular.module('cotopaxiApp').controller('NewCharacterController', function ($http, $location, $rootScope, $scope, currentUserProfile, Character) {
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

  $scope.increment = function(attributeName) {
    console.log('Incrementing ' + attributeName)

    $scope.currentCharacter.incrementAttribute(attributeName)
  }

  $scope.decrement = function(attributeName) {
    console.log('Decrementing ' + attributeName)

    $scope.currentCharacter.decrementAttribute(attributeName)
  }

  $scope.saveCharacter = function() {
    if ($scope.currentCharacter.totalCharacterPoints() != 4) {
      $scope.badAttributePoints = true
      return
    } else {
      $scope.badAttributePoints = false
    }

    $scope.currentCharacter.$save(function(savedCharacter) {
      $location.path("/character/" + savedCharacter.id)
    })      
  }    

  $scope.characters = currentUserProfile.characters

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
  $scope.currentCharacter.user_profile = currentUserProfile.id
})

