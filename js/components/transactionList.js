angular.module('moneyApp')
.controller('transactionListCtrl', function(TransactionService) {
  var ctrl = this;

  ctrl.transactions = [];
  ctrl.transactionList = [];

  ctrl.loading = true;

  ctrl.t = {
    noTransactions : t('money', 'No transactions.'),
    placeholderDestAccount : t('money', 'Destination Account'),
    placeholderTimestamp : t('money', 'Date/Time'),
    placeholderDescription : t('money', 'Description'),
    placeholderValue : t('money', 'Value'),
  };

  // Reflect changes in transactionList
  TransactionService.registerObserverCallback(function(ev) {
    if (ev.event === 'create') {
      TransactionService.getById(ev.transactionId).then(function(transaction) {
        ctrl.transactions.push(transaction);
      });
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

  ctrl.submitTransaction = function() {
    TransactionService.create(ctrl.account.id, ctrl.newTransaction.destAccountId, ctrl.newTransaction.value, 1, ctrl.newTransaction.timestamp, ctrl.newTransaction.description);
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
