angular.module('moneyApp')
.controller('transactionListCtrl', function(TransactionService) {
  var ctrl = this;

  ctrl.transactionList = [];

  ctrl.loading = true;

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

});

angular.module('moneyApp')
.directive('transactionList', function() {
  return {
    scope: {},
    controller: 'transactionListCtrl',
    controllerAs: 'ctrl',
    bindToController: {
      account: '=account'
    },
    templateUrl: OC.linkTo('money', 'templates/transactionList.html')
  };
});
