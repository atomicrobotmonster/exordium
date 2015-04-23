(function() {
  'use strict';

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
            elem.find('span.spinner-widget-value').text(ngModelController.$viewValue);
            if (ngModelController.$viewValue < 0) { 
              elem.addClass('spinner-widget-negative-value');
            } else {
            	elem.removeClass('spinner-widget-negative-value');
            }
          };

          var setValue = function(newValue) {
            ngModelController.$setViewValue(newValue);
            ngModelController.$render();
          };

          var onIncrement = function() {
            console.log('Incrementing from value ' + ngModelController.$viewValue + '.');
           	var newValue = scope.increment();
           	setValue(newValue);
           	console.log('Incremented to ' + newValue + '.');
          };

          var onDecrement = function() {
           	console.log('Decrementing from ' + ngModelController.$viewValue + '.');
           	var newValue = scope.decrement();
           	setValue(newValue);
           	console.log('Decremented to ' + newValue + '.');
          };

          elem.find('button.increment').bind('click',onIncrement);
          elem.find('button.decrement').bind('click',onDecrement);
           
          elem.on('mouseenter', function() { 
           	elem.addClass('active-spinner');
          });

          elem.on('mouseleave', function() { 
           	elem.removeClass('active-spinner');
          });
        }
  	};
  });
}());