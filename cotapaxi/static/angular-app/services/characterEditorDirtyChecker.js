'use strict'

cotopaxiApp.factory('CharacterEditorDirtyChecker', function($rootScope){ 
	var addListener = function($scope) {
		var removeListener = $rootScope.$on('$routeChangeStart', function(event, next, current) {
		  if($scope.characterForm.$dirty && !confirm('Do you want to continue without saving your changes?')) {
            event.preventDefault()
          }
		})

		$scope.$on("$destroy", removeListener)
	}

	return { 
		registerCharacterForm : addListener 
	}
})