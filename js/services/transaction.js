angular.module('moneyApp')
.service('TransactionService', function($http) {

  var ctrl = this;

  var observerCallbacks = [];

  ctrl.registerObserverCallback = function(callback) {
    observerCallbacks.push(callback);
  };

  var notifyObservers = function(eventname, transactionId) {
    var ev = {
      event: eventname,
      transactionId: transactionId
    };
    angular.forEach(observerCallbacks, function(callback) {
      callback(ev);
    });
  };

  ctrl.getTransactionsForAccount = function(accountId) {
    return $http.get('ajax/get-transactions-for-account', {
      params: {
        accountId: accountId
      }
    }).then(function(response) {
  		return response.data;
  	});
  };

  ctrl.getById = function(transactionId) {
    return $http.get('ajax/get-transaction', {
      params: {
        transactionId: transactionId
      }
    }).then(function(response) {
      return response.data;
    });
  };

  ctrl.create = function(srcAccountId, destAccountId, value, convertRate, timestamp, description) {
    // API: addSimpleTransaction($srcAccountId, $destAccountId, $value, $convertRate, $timestamp, $description)
    return $http.post('ajax/add-simple-transaction', {
      srcAccountId: srcAccountId,
      destAccountId: destAccountId,
      value: value,
      convertRate: convertRate,
      timestamp: timestamp,
      description: description
    }).then(function(response) {
      notifyObservers('create', response.data.id);
    });
  };

});
