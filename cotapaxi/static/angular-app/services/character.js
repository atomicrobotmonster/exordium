(function() {
  'use strict';

  angular.module('cotopaxiApp').factory('Character', function($resource) {
    var Character = $resource('http://localhost:8000/api/character/:id', null, {
      'update': { method:'PUT', params: {id:'@id'} }
    });

    Character.prototype.totalCharacterPoints = function() {
      return this.unassigned_attribute_points +
        this.strength +
        this.agility +
        this.mind +
        this.appeal;
    };

    // only one attribute is allowed to be set to -1 as a special case
    Character.prototype.isAnyAttributeBelowZero = function() {
    	return this.strength < 0 || this.agility < 0 || this.mind < 0 || this.appeal < 0;
    };

    Character.prototype.incrementAttribute = function(attribute) {
      if (this.unassigned_attribute_points > 0) {
  	    this.unassigned_attribute_points--;
  	    this[attribute]++;
      }

      return this[attribute];
    };

    Character.prototype.decrementAttribute = function(attribute) {
      if (this[attribute] > 0 || (this[attribute] === 0 && !this.isAnyAttributeBelowZero())) {
  	    this.unassigned_attribute_points++;
  	    this[attribute]--;
      }	

      return this[attribute];
    };

    return Character;
  });
}());
