angular.module('moneyApp')
.controller('transactionListCtrl', function(TransactionService, AccountService, orderByFilter) {
  var ctrl = this;

  ctrl.transactions = [];

  // Get accounts for dropdown-menu
  ctrl.availableAccounts = [];
  AccountService.getAccounts().then(function(accounts) {
    ctrl.availableAccounts = _.unique(accounts);
  });

  ctrl.loading = true;

  ctrl.t = {
    noTransactions : t('money', 'No transactions.'),
    placeholderDestAccount : t('money', 'Destination Account'),
    placeholderDate : t('money', 'Date'),
    placeholderDescription : t('money', 'Description'),
    placeholderValue : t('money', 'Value'),
  };

  // Initialize newTransaction
  ctrl.newTransaction = [];

  ctrl.reorderList = function() {
    ctrl.transactions = orderByFilter(ctrl.transactions, ['date','timestampAdded'], true);
  };

  // Reflect changes in transactionList
  TransactionService.registerObserverCallback(function(ev) {
    if (ev.event === 'create') {
      ctrl.transactions.push(ev.response);
      TransactionService.calculateValue(ctrl.transactions[ctrl.transactions.length-1], ctrl.account.id);
      TransactionService.checkStatus(ctrl.transactions[ctrl.transactions.length-1]);
      ctrl.reorderList();
    } else if (ev.event === 'update') {
      for (var i = 0; i < ctrl.transactions.length; i++) {
        if (ctrl.transactions[i].id === ev.response.id) {
          ctrl.transactions[i] = ev.response;
          TransactionService.calculateValue(ctrl.transactions[i], ctrl.account.id);
          TransactionService.checkStatus(ctrl.transactions[i]);
          ctrl.reorderList();
          break;
        }
      }
    } else if (ev.event === 'addedSplit') {
      for (var i = 0; i < ctrl.transactions.length; i++) {
        if (parseInt(ctrl.transactions[i].id) === ev.response.transactionId) {
          ctrl.transactions[i].splits.push(ev.response);
          TransactionService.calculateValue(ctrl.transactions[i], ctrl.account.id);
          TransactionService.checkStatus(ctrl.transactions[i]);
          break;
        }
      }
    } else if (ev.event === 'deletedSplit') {
      for (var i = 0; i < ctrl.transactions.length; i++) {
        if (parseInt(ctrl.transactions[i].id) === ev.response.transactionId) {
          for (var j = 0; j < ctrl.transactions[i].splits.length; j++) {
            if (parseInt(ctrl.transactions[i].splits[j].id) === ev.response.id) {
              ctrl.transactions[i].splits.splice(j,1);
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
          } else {
            TransactionService.calculateValue(ctrl.transactions[i], ctrl.account.id);
            TransactionService.checkStatus(ctrl.transactions[i]);
          }
        }
      }
    } else if (ev.event === 'updatedSplit') {
      for (var i = 0; i < ctrl.transactions.length; i++) {
        if (parseInt(ctrl.transactions[i].id) === ev.response.transactionId) {
          for (var j = 0; j < ctrl.transactions[i].splits.length; j++) {
            if (parseInt(ctrl.transactions[i].splits[j].id) === ev.response.id) {
              ctrl.transactions[i].splits[j] = ev.response;
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
          } else {
            TransactionService.calculateValue(ctrl.transactions[i], ctrl.account.id);
            TransactionService.checkStatus(ctrl.transactions[i]);
          }
        }
      }
    }
  });

  // Get transactions for account
  TransactionService.getTransactionsForAccount(ctrl.account.id).then(function(transactions) {
    if (transactions.length > 0) {
        ctrl.transactions = transactions;
        ctrl.reorderList();
        ctrl.loading = false;
    } else {
      ctrl.loading = false;
    }
  });

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
    TransactionService.create(ctrl.account.id, ctrl.newTransaction.destAccountId, -ctrl.newTransaction.inValue+ctrl.newTransaction.outValue, 1, ctrl.newTransaction.date, ctrl.newTransaction.description).then(function(response) {
      ctrl.resetForm();
      ctrl.newTransactionLoading = false;
    });
  };

  // TESTING!! TODO
  ctrl.importTransactions = {};
  ctrl.importTransactions.availableColumns = [
    {
      id: 0,
      lines: [
        "test1",
        "test2"
      ]
    },
    {
      id: 1,
      lines: [
        "line1",
        "line2"
      ]
    }
  ];

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
