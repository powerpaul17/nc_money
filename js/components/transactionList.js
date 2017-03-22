angular.module('moneyApp')
.controller('transactionListCtrl', function(TransactionService, AccountService) {
  var ctrl = this;

  ctrl.transactions = [];

  // Get accounts for dropdown-menu
  ctrl.availableAccounts = [];
  AccountService.getAccounts().then(function(accounts) {
    ctrl.availableAccounts = _.unique(accounts);
  });

  ctrl.t = {
    noTransactions: t('money', 'No transactions.'),
    placeholderDestAccount: t('money', 'Destination Account'),
    placeholderDate: t('money', 'Date'),
    placeholderDescription: t('money', 'Description'),
    placeholderInValue: t('money', 'In'),
    placeholderOutValue: t('money', 'Out')
  };

  // Initialize newTransaction
  ctrl.newTransaction = [];

  // Reflect changes in transactionList
  TransactionService.registerObserverCallback(function(ev) {
    if (ev.event === 'create') {
      var index = ctrl.insertIntoTransactions(ev.response);
      if (index >= 0) {
        TransactionService.calculateValue(ctrl.transactions[index], ctrl.account);
        TransactionService.checkStatus(ctrl.transactions[index]);
        ctrl.transactionListScroller.applyUpdates(index, [ctrl.transactions[index], ctrl.transactions[index + 1]]);
      }
    } else if (ev.event === 'createBatch') {
      ctrl.transactions = [];
      ctrl.transactionListScroller.reload();
    } else if (ev.event === 'update') {
      for (var i = 0; i < ctrl.transactions.length; i++) {
        if (ctrl.transactions[i].id === ev.response.id) {
          ctrl.transactions.splice(i,1);
          var index = ctrl.insertIntoTransactions(ev.response);
          if (index >= 0) {
            TransactionService.calculateValue(ctrl.transactions[index], ctrl.account);
            TransactionService.checkStatus(ctrl.transactions[index]);
            if (index === i) {
              ctrl.transactionListScroller.applyUpdates(index, ctrl.transactions[index]);
            } else {
              ctrl.transactionListScroller.applyUpdates(i, []);
              ctrl.transactionListScroller.applyUpdates(index, [ctrl.transactions[index], ctrl.transactions[index + 1]]);
            }
          }
          break;
        }
      }
    } else if (ev.event === 'delete') {
      for (var i = 0; i < ctrl.transactions.length; i++) {
        if (ctrl.transactions[i].id === ev.response.id) {
          ctrl.transactions.splice(i,1);
          ctrl.transactionListScroller.applyUpdates(i, []);
        }
      }
    } else if (ev.event === 'addedSplit') {
      for (var i = 0; i < ctrl.transactions.length; i++) {
        if (parseInt(ctrl.transactions[i].id) === ev.response.transactionId) {
          ctrl.transactions[i].splits.push(ev.response);
          TransactionService.calculateValue(ctrl.transactions[i], ctrl.account);
          TransactionService.checkStatus(ctrl.transactions[i]);
          ctrl.transactionListScroller.applyUpdates(i, ctrl.transactions[i]);
          break;
        }
      }
    } else if (ev.event === 'deletedSplit') {
      for (var i = 0; i < ctrl.transactions.length; i++) {
        if (parseInt(ctrl.transactions[i].id) === ev.response.transactionId) {
          for (var j = 0; j < ctrl.transactions[i].splits.length; j++) {
            if (parseInt(ctrl.transactions[i].splits[j].id) === ev.response.id) {
              ctrl.transactions[i].splits.splice(j,1);
              ctrl.transactionListScroller.applyUpdates(i, ctrl.transactions[i]);
              break;
            }
          }
          var number = 0;
          for (var j = 0; j < ctrl.transactions[i].splits.length; j++) {
            if (parseInt(ctrl.transactions[i].splits[j].destAccountId) === ctrl.account.id) {
              number++;
            }
          }
          if(number === 0) {
            ctrl.transactions.splice(i,1);
            ctrl.transactionListScroller.applyUpdates(i, []);
          } else {
            TransactionService.calculateValue(ctrl.transactions[i], ctrl.account);
            TransactionService.checkStatus(ctrl.transactions[i]);
          }
        }
      }
    } else if (ev.event === 'updatedSplit') {
      for (var i = 0; i < ctrl.transactions.length; i++) {
        if (ctrl.transactions[i].id === ev.response.transactionId) {
          for (var j = 0; j < ctrl.transactions[i].splits.length; j++) {
            if (ctrl.transactions[i].splits[j].id === ev.response.id) {
              ctrl.transactions[i].splits[j] = ev.response;
              ctrl.transactionListScroller.applyUpdates(i, ctrl.transactions[i]);
              break;
            }
          }
          var number = 0;
          for (var j = 0; j < ctrl.transactions[i].splits.length; j++) {
            if (parseInt(ctrl.transactions[i].splits[j].destAccountId) === ctrl.account.id) {
              number++;
            }
          }
          if (number === 0) {
            ctrl.transactions.splice(i,1);
            ctrl.transactionListScroller.applyUpdates(i, []);
          } else {
            TransactionService.calculateValue(ctrl.transactions[i], ctrl.account);
            TransactionService.checkStatus(ctrl.transactions[i]);
          }
        }
      }
    }
  });

  ctrl.fetchFromServer = function(resultOffset = 0, resultLimit = 100) {
    if (ctrl.account.id === 'Unbalanced') {
      // Get unbalanced transactions for account
      return TransactionService.getUnbalancedTransactions(resultOffset, resultLimit);
    } else {
      // Get transactions for account
      return TransactionService.getTransactionsForAccount(ctrl.account, resultOffset, resultLimit);
    }
  };

  // Get transactions for ui-scroller
  ctrl.get = function(index, count, success) {
    console.log('Get (' + index + ',' + count + ') from transactions');
    var result = [];
    var haveToLoadFromServer = false;
    for (var i = 0; i < count; i++) {
      if ((index + i) >= 0) {
        // var cacheItem = transactionCache.get((index + i).toString());
        var cacheItem = ctrl.transactions[index + i];
        if (!cacheItem) {
          haveToLoadFromServer = true;
          break;
        } else {
          result.push(cacheItem);
        }
      }
    }
    if (haveToLoadFromServer) {
      var fetchIndex = 0;
      if (index < 0) {
        fetchIndex = 0;
      } else {
        fetchIndex = index;
      }
      ctrl.fetchFromServer(fetchIndex).then(function(transactions) {
        result = [];
        ctrl.transactions.splice(fetchIndex, transactions.length);
        for (var i = 0; i < transactions.length; i++) {
          // transactionCache.put((fetchIndex + i).toString(), transactions[i]);
          ctrl.transactions.splice(fetchIndex + i, 0, transactions[i]);
          if (i < (count + fetchIndex - index)) {
            result.push(transactions[i]);
          }
        }
        success(result);
      });
    } else {
      success(result);
    }
  };

  locationOfElement = function(array, element, compareFunction, start, end) {
    if (array.length <= 0) return -1;
    start = start || 0;
    end = end || (array.length - 1);
    var pivot = parseInt(start + (end - start) / 2);
    var c = compareFunction(array[pivot], element);
    if ((end - start) <= 1) return c < 0 ? (pivot) : (pivot + 1);
    if (c > 0) {
      return locationOfElement(array, element, compareFunction, pivot, end);
    } else if (c < 0) {
      return locationOfElement(array, element, compareFunction, start, pivot);
    } else {
      return pivot;
    }
  }

  ctrl.insertIntoTransactions = function(newTransaction) {
    var location = locationOfElement(ctrl.transactions, newTransaction, function(a, b) {
      if (a.date === b.date) {
        if (a.timestampAdded === b.timestampAdded) {
          return a.id - b.id;
        } else {
          return new Date(a.timestampAdded) - new Date(b.timestampAdded);
        }
      } else {
        return new Date(a.date) - new Date(b.date);
      }
    });
    if (location < ctrl.transactions.length) {
      ctrl.transactions.splice(location, 0, newTransaction);
      return location;
    } else {
      return undefined;
    }
  };

  ctrl.resetForm = function() {
    ctrl.newTransaction.date = "";
    ctrl.newTransaction.description = "";
    ctrl.newTransaction.destAccountId = undefined;
    ctrl.newTransaction.inValue = undefined;
    ctrl.newTransaction.outValue = undefined;
    ctrl.newTransactionForm.$setPristine();
    ctrl.newTransactionForm.$setUntouched();
  };

  ctrl.submitTransaction = function() {
    if(ctrl.newTransaction.inValue === undefined) {
      ctrl.newTransaction.inValue = 0;
    };
    if(ctrl.newTransaction.outValue === undefined) {
      ctrl.newTransaction.outValue = 0;
    };
    ctrl.newTransactionLoading = true;
    // TODO: Check for currencies and ask for convert rate!
    TransactionService.create(ctrl.account, ctrl.newTransaction.destAccountId, -ctrl.newTransaction.inValue+ctrl.newTransaction.outValue, 1, ctrl.newTransaction.date, ctrl.newTransaction.description).then(function(response) {
      ctrl.resetForm();
      ctrl.newTransactionLoading = false;
    });
  };

});

angular.module('moneyApp')
.directive('transactionList', function() {
  return {
    restrict: 'EA',
    scope: {},
    controller: 'transactionListCtrl',
    controllerAs: 'ctrl',
    bindToController: {
      account: '=account'
    },
    templateUrl: OC.linkTo('money', 'templates/transactionList.html')
  };
});
