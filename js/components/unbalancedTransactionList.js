angular.module('moneyApp')
.controller('unbalancedTransactionListCtrl', function(TransactionService, AccountService) {
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
      ctrl.transactions.push(ev.response);
      ctrl.resetForm();
    } else if (ev.event === 'addedSplit') {
      for (var i = 0; i < ctrl.transactions.length; i++) {
        if (parseInt(ctrl.transactions[i].id) === ev.response.transactionId) {
          ctrl.transactions[i].splits.push(ev.response);
          // TransactionService.calculateValue(ctrl.transactions[i], ctrl.account.id);
          TransactionService.checkStatus(ctrl.transactions[i]);
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
            // TransactionService.calculateValue(ctrl.transactions[i], ctrl.account.id);
            TransactionService.checkStatus(ctrl.transactions[i]);
          }
        }
      }
    }
  });

  // Get transactions for account
  TransactionService.getUnbalancedTransactions().then(function(transactions) {
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
.directive('unbalancedTransactionList', function() {
  return {
    restrict: 'EA',
    scope: {},
    controller: 'unbalancedTransactionListCtrl',
    controllerAs: 'ctrl',
    bindToController: {},
    templateUrl: OC.linkTo('money', 'templates/unbalancedTransactionList.html')
  };
});
