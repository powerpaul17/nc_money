angular.module('moneyApp')
.controller('transactionListItemCtrl', function($route, $routeParams, TransactionService, AccountService) {
  var ctrl = this;

  AccountService.getAccounts().then(function(accounts) {
    ctrl.availableAccounts = _.unique(accounts);
  });

  // Initialize newSplit variable
  ctrl.newSplit = [];
  ctrl.newSplit.inValue = undefined;
  ctrl.newSplit.outValue = undefined;
  ctrl.newSplit.description = "";
  ctrl.newSplit.destAccountId = undefined;

  ctrl.toggleTransaction = function() {
    ctrl.showSplits = !ctrl.showSplits;
  };

  ctrl.updateTransaction = function() {
    ctrl.transactionItemLoading = true;
    TransactionService.update(ctrl.transaction).then(function(response) {
      ctrl.resetTransactionForm();
      ctrl.transactionItemLoading = false;
    });
  };

  ctrl.addSplit = function() {
    ctrl.newSplitLoading = true;
    ctrl.newSplit.convertRate = 1; // for the moment we do not look at convert rates ;)
    TransactionService.addSplit(ctrl.transaction.id, ctrl.newSplit.destAccountId, ctrl.newSplit.inValue-ctrl.newSplit.outValue, ctrl.newSplit.convertRate, ctrl.newSplit.description).then(function() {
      ctrl.resetNewSplitForm();
      ctrl.newSplitLoading = false;
    });
  };

  ctrl.resetTransactionForm = function() {
    ctrl.transactionForm.$setPristine();
    ctrl.transactionForm.$setUntouched();
  }

  ctrl.resetNewSplitForm = function() {
    ctrl.newSplit.inValue = undefined;
    ctrl.newSplit.outValue = undefined;
    ctrl.newSplit.description = "";
    ctrl.newSplit.destAccountId = undefined;
    ctrl.newSplitForm.$setPristine();
    ctrl.newSplitForm.$setUntouched();
  };

});

angular.module('moneyApp')
.directive('transactionListItem', function() {
  return {
    scope: {},
    controller: 'transactionListItemCtrl',
    controllerAs: 'ctrl',
    bindToController: {
      transaction: '=data',
      account: '=account'
    },
    templateUrl: OC.linkTo('money', 'templates/transactionListItem.html')
  };
});
