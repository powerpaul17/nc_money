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

  // Reflect changes in transactionList
  TransactionService.registerObserverCallback(function(ev) {
    if (ev.event === 'create') {
      ctrl.transactions.push(ev.transaction);
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
    // ctrl.resetForm(); TODO with notification
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
