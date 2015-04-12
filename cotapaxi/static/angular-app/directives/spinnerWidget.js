'use strict'

angular.module('cotopaxiApp').directive('spinnerWidget', function() {
	return {
	  restrict: 'E',
	  scope: {
	    value: '@', 
        increment: '&',
        decrement: '&'
	  },
      templateUrl: '/static/angular-app/views/spinnerWidget.html',
      link: function(scope, elem, attrs) { 
      }
	}
})