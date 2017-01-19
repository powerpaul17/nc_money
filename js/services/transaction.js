angular.module('moneyApp')
.service('TransactionService', function($http) {

  var ctrl = this;

  var observerCallbacks = [];

  ctrl.registerObserverCallback = function(callback) {
    observerCallbacks.push(callback);
  };

  var notifyObservers = function(eventname, response) {
    var ev = {
      event: eventname,
      transaction: response
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

  ctrl.getTransactionById = function(transactionId) {
    return $http.get('ajax/get-transaction', {
      params: {
        transactionId: transactionId
      }
    }).then(function(response) {
      return response.data;
    });
  };

  ctrl.create = function(srcAccountId, destAccountId, value, convertRate, date, description) {
    // API: addSimpleTransaction($srcAccountId, $destAccountId, $value, $convertRate, $date, $description)
    return $http.post('ajax/add-simple-transaction', {
      srcAccountId: srcAccountId,
      destAccountId: destAccountId,
      value: value,
      convertRate: convertRate,
      date: date,
      description: description
    }).then(function(response) {
      notifyObservers('create', response.data);
    }, function(errorResponse) {
      
    });
  };

  ctrl.update = function() {
    console.log("transaction update: TODO!");
  };

  ctrl.addSplit = function(transactionId, destAccountId, value, convertRate, description) {
    return $http.post('ajax/add-split', {
      transactionId: transactionId,
      destAccountId: destAccountId,
      value: value,
      convertRate: convertRate,
      description: description
    }).then(function(response) {
      notifyObservers('addedSplit', response.data);
    }, function(errorResponse) {

    });
  };

});
