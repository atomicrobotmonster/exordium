'use strict'

angular.module('cotopaxiApp').controller('CharacterEditorController', function ($http, $location, $routeParams, $rootScope, $scope, currentUserProfile, Character) {
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
      $location.path("/character/" + $scope.currentCharacter.id)
    })
  }

  $scope.deleteCharacter = function(id) {
    $scope.currentCharacter.$remove({id: id}, function(data) {
      $location.path("/character")
    })
  }

  $scope.increment = function(attributeName) {
    console.log('Incrementing ' + attributeName)

    $scope.currentCharacter.incrementAttribute(attributeName)
  }

  $scope.decrement = function(attributeName) {
    console.log('Decrementing ' + attributeName)

    $scope.currentCharacter.decrementAttribute(attributeName)
  }


  $scope.showNewCharacterLink = false
  
  var idToSelect = null
  if (currentUserProfile) {  
    //TOOD userProfile can probably be removed
    $rootScope.shared = {
      userProfile: currentUserProfile,
      authenticated: true
    }

    if (currentUserProfile.characters.length == 0) {
      $location.path('/new-character')
      return
    } else if ($routeParams.characterId) {
      idToSelect = $routeParams.characterId
    } else {
      idToSelect = currentUserProfile.characters.sort(function(a, b) {
        var x = a['name']; var y = b['name']
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })[0].id
    }

    $scope.showNewCharacterLink = false
    $scope.badAttributePoints = false
    $scope.currentCharacter = Character.get({ 'id': idToSelect })
  } else {
    $rootScope.shared = {
      userProfile: null,
      authenticated: false
    }
  }
})