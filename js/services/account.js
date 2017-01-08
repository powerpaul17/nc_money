angular.module('moneyApp')
.service('AccountService', function($http) {

  var ctrl = this;

  var observerCallbacks = [];

  ctrl.registerObserverCallback = function(callback) {
    observerCallbacks.push(callback);
  };

  var notifyObservers = function(eventname, accountId) {
    var ev = {
      event: eventname,
      accountId: accountId
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

  ctrl.getById = function(aid) {
    return $http.get('ajax/get-account', {
      params: {
        accountId: aid
      }
    }).then(function(response) {
      return response.data;
    });
  };

  ctrl.update = function(account) {
    return $http.put('ajax/update-account', account).then(function(response) {
      notifyObservers('update', account.id);
    });
  };

  ctrl.create = function(account) {
    return $http.post('ajax/add-account', account).then(function(response) {
      notifyObservers('create', response.data.id)
    });
  };

});
