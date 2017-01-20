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
      response: response
    };
    angular.forEach(observerCallbacks, function(callback) {
      callback(ev);
    });
  };

  // calculate total value and destination account for transaction
  ctrl.calculateValue = function(transaction, accountId) {
    var value = 0;
    var destAccountCount = 0;
    transaction.multipleSplits = false;
    for(var j = 0; j < transaction.splits.length; j++) {
      if (parseInt(transaction.splits[j].destAccountId) === parseInt(accountId)) {
        value += transaction.splits[j].value;
      } else {
        if(destAccountCount === 0) {
          transaction.destAccountId = transaction.splits[j].destAccountId;
          destAccountCount++;
        } else {
          transaction.multipleSplits = true;
        }
      }
    }
    transaction.value = value;
  }

  ctrl.getTransactionsForAccount = function(accountId) {
    return $http.get('ajax/get-transactions-for-account', {
      params: {
        accountId: accountId
      }
    }).then(function(response) {
      // add and calculate additional data to each transaction
      for(var i = 0; i < response.data.length; i++) {
        // calculate total value and destination account for transaction
        ctrl.calculateValue(response.data[i], accountId);
      }
  		return response.data;
  	});
  };

  // ctrl.getTransactionById = function(transactionId) {
  //   return $http.get('ajax/get-transaction', {
  //     params: {
  //       transactionId: transactionId
  //     }
  //   }).then(function(response) {
  //     return response.data;
  //   });
  // };

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
      ctrl.calculateValue(response.data, srcAccountId);
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

  ctrl.deleteSplit = function(splitId) {
    return $http.post('ajax/delete-split', {splitId: splitId}).then(function(response) {
      notifyObservers('deletedSplit', response.data);
    }, function(errorResponse) {

    });
  };

});
