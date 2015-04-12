'use strict'

angular.module('cotopaxiApp').directive('spinnerWidget', function() {
	return {
	  restrict: 'E',
	  require: 'ngModel',
	  scope: {
        increment: '&',
        decrement: '&'
	  },
      templateUrl: '/static/angular-app/views/spinnerWidget.html',
      link: function(scope, elem, attrs, ngModelController) { 

      	 //render the value when the ng-model changes
         ngModelController.$render = function() {
           elem.find('span.spinner-widget-value').text(ngModelController.$viewValue)
         }
      }
	}
})