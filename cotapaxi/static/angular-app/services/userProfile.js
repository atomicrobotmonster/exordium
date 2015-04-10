'use strict'

angular.module('cotopaxiApp').factory('UserProfile', function($resource) {
  return $resource('http://localhost:8000/api/current-user')  
})
