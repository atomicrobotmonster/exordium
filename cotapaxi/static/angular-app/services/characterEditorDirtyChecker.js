'use strict'

cotopaxiApp.factory('CharacterEditorDirtyChecker', function($rootScope, $window, $modal) { 

    var showConfirmationModal = function() {
      return $modal.open({
        templateUrl: '/static/angular-app/views/characterEditorDirtyModal.html',
        controller: 'CharacterEditorDirtyModalController'
      })
    }

	var addListener = function($scope) {

		var removeListener = $rootScope.$on('$locationChangeStart', function(event, next, current) {
		  if($scope.characterForm.$dirty) { 
		  	showConfirmationModal().result.then(function() {
		      removeListener()
		      console.log('User confirms losing changes and wants to navigate to ' + next + '.')
          $window.location.href = next
		  	})
  
            event.preventDefault()
          }
		})

		$scope.$on('$destroy', removeListener)
	}

	return { 
		registerCharacterForm : addListener 
	}
})
.controller('CharacterEditorDirtyModalController', function ($scope, $modalInstance) {

  $scope.continue = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});