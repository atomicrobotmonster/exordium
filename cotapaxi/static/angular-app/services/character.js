'use strict'

angular.module('cotopaxiApp').factory('Character', function($resource) {
  var Character = $resource('http://localhost:8000/api/character/:id', null, {
    'update': { method:'PUT', params: {id:'@id'} }
  })

  Character.prototype.totalCharacterPoints = function() {
    return this.unassigned_attribute_points 
      + this.strength 
      + this.agility
      + this.mind
      + this.appeal
  }

  return Character 
})

