'use strict'

angular.module('cotopaxiApp').factory('Character', function($resource) {
  return $resource('http://localhost:8000/api/character/:id', null, {
    'update': { method:'PUT', params: {id:'@id'} }
  }) 
})
