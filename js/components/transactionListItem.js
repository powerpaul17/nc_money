angular.module('moneyApp')
.controller('transactionListItemCtrl', function($route, $routeParams, TransactionService, AccountService) {
  var ctrl = this;

  // save a copy before form was edited
  ctrl.originalTransaction = angular.copy(ctrl.transaction);

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
    if (ctrl.transactionForm.destAccountId.$dirty || ctrl.transactionForm.inValue.$dirty || ctrl.transactionForm.outValue.$dirty) {
      for (var i = 0; i < ctrl.transaction.splits.length; i++) {

        var originalValue = ctrl.transaction.splits[i].value;

        if (ctrl.transaction.splits[i].destAccountId === ctrl.originalTransaction.destAccountId) {
          ctrl.transaction.splits[i].destAccountId = ctrl.transaction.destAccountId;
          ctrl.transaction.splits[i].shownValue = ctrl.transaction.outValue - ctrl.transaction.inValue;

          // Handle multiple currencies
          if (ctrl.transaction.splits[i].foreignCurrency) {
            ctrl.transaction.splits[i].value = ctrl.transaction.splits[i].shownValue * ctrl.transaction.convertRate / ctrl.transaction.splits[i].convertRate;
          } else {
            ctrl.transaction.splits[i].value = ctrl.transaction.splits[i].shownValue;
          }

          TransactionService.updateSplit(ctrl.transaction.splits[i], ctrl.originalTransaction.destAccountId, originalValue);
          // break;
        } else if (ctrl.transaction.splits[i].destAccountId === ctrl.account.id) {
          ctrl.transaction.splits[i].value = ctrl.transaction.inValue - ctrl.transaction.outValue;
          TransactionService.updateSplit(ctrl.transaction.splits[i], ctrl.transaction.splits[i].destAccountId, originalValue);
        }
      }
      if ((!ctrl.originalTransaction.destAccountId) && (ctrl.transaction.destAccountId)) {
        // TODO: convert rate
        TransactionService.addSplit(ctrl.transaction.id, ctrl.transaction.destAccountId, ctrl.transaction.outValue - ctrl.transaction.inValue, 1, '');
      }
    }
    TransactionService.update(ctrl.transaction).then(function(response) {
      ctrl.originalTransaction = angular.copy(ctrl.transaction);
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
