angular.module('moneyApp')
.controller('transactionListCtrl', function(TransactionService, AccountService) {
  var ctrl = this;

  ctrl.transactions = [];

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

  // Reflect changes in transactionList
  TransactionService.registerObserverCallback(function(ev) {
    if (ev.event === 'create') {
      ctrl.transactions.push(ev.response);
      ctrl.resetForm();
    } else if (ev.event === 'addedSplit') {
      for (var i = 0; i < ctrl.transactions.length; i++) {
        if (parseInt(ctrl.transactions[i].id) === ev.response.transactionId) {
          ctrl.transactions[i].splits.push(ev.response);
          TransactionService.calculateValue(ctrl.transactions[i], ctrl.account.id);
        }
      }
    } else if (ev.event === 'deletedSplit') {
      for (var i = 0; i < ctrl.transactions.length; i++) {
        if (parseInt(ctrl.transactions[i].id) === ev.response.transactionId) {
          for (var j = 0; j < ctrl.transactions[i].splits.length; j++) {
            if (parseInt(ctrl.transactions[i].splits[j].id) === ev.response.id) {
              ctrl.transactions[i].splits.splice(j,1);
            }
          }
          if(ctrl.transactions[i].splits.length === 0) {
            ctrl.transactions.splice(i,1);
          } else {
            TransactionService.calculateValue(ctrl.transactions[i], ctrl.account.id);
          }
        }
      }
    }
  });

  // Get transactions for account
  TransactionService.getTransactionsForAccount(ctrl.account.id).then(function(transactions) {
    if (transactions.length > 0) {
      //$scope.$apply(function() {
        ctrl.transactions = transactions;
        ctrl.loading = false;
      //});
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
  };

  ctrl.submitTransaction = function() {
    if(ctrl.newTransaction.inValue === undefined) {
      ctrl.newTransaction.inValue = 0;
    };
    if(ctrl.newTransaction.outValue === undefined) {
      ctrl.newTransaction.outValue = 0;
    };
    TransactionService.create(ctrl.account.id, ctrl.newTransaction.destAccountId, -ctrl.newTransaction.inValue+ctrl.newTransaction.outValue, 1, ctrl.newTransaction.date, ctrl.newTransaction.description);
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
