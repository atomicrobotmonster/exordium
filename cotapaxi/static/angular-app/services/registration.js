'use strict'

angular.module('cotopaxiApp').factory('Registration', function($resource) {
  return $resource('http://localhost:8000/api/userprofile')  
})
