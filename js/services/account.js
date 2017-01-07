angular.module('moneyApp')
.service('AccountService', function($http) {

  var ctrl = this;

  var observerCallbacks = [];

  ctrl.registerObserverCallback = function(callback) {
    observerCallbacks.push(callback);
  };

  var notifyObservers = function(eventname, aid) {
    var ev = {
      event: eventName,
      aid: aid,
      accounts: ctrl.getAccounts()
    };
    angular.forEach(observerCallbacks, function(callback) {
      callback(ev);
    });
  };

  ctrl.getAccounts = function() {
    return $http.get('ajax/get-accounts').then(function(response) {
  		return response.data;
  	});
  };

  // TODO
  ctrl.getById = function(aid) {
    return $http.get('ajax/get-account').then(function(response) {
      return response.data;
    });
  };

});
