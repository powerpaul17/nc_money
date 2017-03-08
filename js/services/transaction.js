angular.module('moneyApp')
.service('TransactionService', function($http, TRANSACTION_STATUS) {

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
    var value = 0.0;
    var destAccountCount = 0;
    transaction.multipleSplits = false;
    transaction.destAccountId = undefined;
    transaction.inValue = 0;
    transaction.outValue = 0;
    for(var j = 0; j < transaction.splits.length; j++) {
      if (parseInt(transaction.splits[j].destAccountId) === parseInt(accountId)) {
        value += transaction.splits[j].value;
        value = Math.round(value*100)/100; // to avoid rounding errors
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
    if (transaction.value > 0) {
      transaction.inValue = transaction.value;
    } else {
      transaction.outValue = -transaction.value;
    }
  }

  ctrl.isFuture = function(transaction) {
    var now = new Date();
    var transactionDate = new Date(transaction.date);
    if (transactionDate > now) {
      return true;
    } else {
      return false;
    }
  };

  ctrl.isBalanced = function(transaction) {
    var value = 0.0;
    for(var i = 0; i < transaction.splits.length; i++) {
      value += transaction.splits[i].value;
      value = Math.round(value*100)/100; // to avoid rounding errors
    }
    if(value === 0) {
      return true;
    } else {
      return false;
    }
  }

  ctrl.checkStatus = function(transaction) {
    if(ctrl.isBalanced(transaction)) {
      if(ctrl.isFuture(transaction)) {
        transaction.status = TRANSACTION_STATUS.indexOf('FUTURE');
      } else {
        transaction.status = TRANSACTION_STATUS.indexOf('BALANCED');
      }
    } else {
      transaction.status = TRANSACTION_STATUS.indexOf('UNBALANCED');
    }
  }

  ctrl.normalizeSplitValues = function(split) {
    split.id = parseInt(split.id);
    split.transactionId = parseInt(split.transactionId);
    split.destAccountId = parseInt(split.destAccountId);
    split.value = parseFloat(split.value);

    split.inValue = 0;
    split.outValue = 0;
    if (split.value > 0) {
      split.inValue = split.value;
    } else {
      split.outValue = -split.value;
    }

  };

  ctrl.normalizeValues = function(transaction) {
    transaction.id = parseInt(transaction.id);
    transaction.value = parseFloat(transaction.value);

    // transaction.inValue = 0;
    // transaction.outValue = 0;
    // if (transaction.value > 0) {
    //   transaction.inValue = transaction.value;
    // } else {
    //   transaction.outValue = -transaction.value;
    // }

    for(var i = 0; i < transaction.splits.length; i++) {
      ctrl.normalizeSplitValues(transaction.splits[i]);
    }
  };

  ctrl.getTransactionsForAccount = function(accountId) {
    return $http.get('ajax/get-transactions-for-account', {
      params: {
        accountId: accountId
      }
    }).then(function(response) {
      // add and calculate additional data to each transaction
      for(var i = 0; i < response.data.length; i++) {
        // calculate total value and destination account for transaction
        ctrl.normalizeValues(response.data[i]);
        ctrl.calculateValue(response.data[i], accountId);
        ctrl.checkStatus(response.data[i]);
      }
  		return response.data;
  	});
  };

  ctrl.getTransactionsForAccountByDate = function(accountId, startDate, endDate) {
    return $http.get('ajax/get-transactions-for-account-by-date', {
      params: {
        accountId: accountId,
        startDate: startDate,
        endDate: endDate
      }
    }).then(function(response) {
      // add and calculate additional data to each transaction
      for(var i = 0; i < response.data.length; i++) {
        // calculate total value and destination account for transaction
        ctrl.normalizeValues(response.data[i]);
        ctrl.calculateValue(response.data[i], accountId);
        ctrl.checkStatus(response.data[i]);
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
      ctrl.normalizeValues(response.data);
      ctrl.calculateValue(response.data, srcAccountId);
      notifyObservers('create', response.data);
    }, function(errorResponse) {

    });
  };

  ctrl.createBatch = function(transactions, srcAccountId) {
    return $http.post('ajax/add-transactions', {
      transactions: transactions
    }).then(function(response) {
      response.data.srcAccountId = srcAccountId;
      notifyObservers('createBatch', response.data);
    }, function(errorResponse) {

    });
  };

  ctrl.update = function(transaction) {
    return $http.put('ajax/update-transaction', transaction).then(function(response) {
      ctrl.normalizeValues(response.data);
      notifyObservers('update', response.data);
    }, function(errorResponse) {

    });
  };

  ctrl.addSplit = function(transactionId, destAccountId, value, convertRate, description) {
    return $http.post('ajax/add-split', {
      transactionId: transactionId,
      destAccountId: destAccountId,
      value: value,
      convertRate: convertRate,
      description: description
    }).then(function(response) {
      ctrl.normalizeSplitValues(response.data);
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

  ctrl.updateSplit = function(split, originalAccount, originalValue) {
    return $http.put('ajax/update-split', split).then(function(response) {
      ctrl.normalizeSplitValues(response.data);
      response.data.originalAccount = originalAccount;
      response.data.originalValue = originalValue;
      notifyObservers('updatedSplit', response.data);
    }, function(errorResponse) {

    });
  };

  ctrl.getUnbalancedTransactions = function() {
    return $http.get('ajax/get-unbalanced-transactions').then(function(response) {
      // add and calculate additional data to each transaction
      if(response.data !== null) {
        for(var i = 0; i < response.data.length; i++) {
          // calculate total value and destination account for transaction
          ctrl.normalizeValues(response.data[i]);
          // ctrl.calculateValue(response.data[i], accountId);
          ctrl.checkStatus(response.data[i]);
        }
      }
  		return response.data;
  	}, function(errorResponse) {

    });
  };

  ctrl.importTransactions = function(srcAccountId, data, progressCallback) {
    // TODO!
    for (var i = 0; i < data.length; i++) {
      ctrl.create(srcAccountId, -1, data[i].value, data[i].convertRate, data[i].date, data[i].description).then(function() {
        if (progressCallback) {
          progressCallback(i / data.length);
        }
      });
    }
  }

});
