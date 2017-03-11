(function() {
  var module = angular.module("google-places", []);
  module.factory("autocompleteService", ['$q', function($q) {
    AutocompleteWrapper = function() {
      this.autocomplete = new google.maps.places.AutocompleteService();
    };

    AutocompleteWrapper.prototype.getPlacePredictions = function(options) {
      var deferred = $q.defer();
      this.autocomplete.getPlacePredictions(options, function (res, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          deferred.resolve(res);
        } else {
          deferred.reject(status);
        }
      });
      return deferred.promise;
    };

    return new AutocompleteWrapper();
  }]);

  module.factory("placesService", ['$q', function($q) {
    PlacesServiceWrapper = function() {
      var div = document.createElement('div');
      this.places = new google.maps.places.PlacesService(div);
    };

    PlacesServiceWrapper.prototype.getDetails = function(options) {
      var deferred = $q.defer();
      this.places.getDetails(options, function (res, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          deferred.resolve(res);
        } else {
          deferred.reject(status);
        }
      });
      return deferred.promise;
    };

    return new PlacesServiceWrapper();
  }]);
})();
