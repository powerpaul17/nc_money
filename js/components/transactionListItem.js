angular.module('moneyApp')
.controller('transactionListItemCtrl', function($route, $routeParams, TransactionService, AccountService) {
  var ctrl = this;

  AccountService.getAccounts().then(function(accounts) {
    ctrl.availableAccounts = _.unique(accounts);
  });

  // Initialize newSplit variable
  ctrl.newSplit = [];
  ctrl.newSplit.inValue = 0;
  ctrl.newSplit.outValue = 0;
  ctrl.newSplit.description = "";
  ctrl.newSplit.destAccountId = undefined;

  ctrl.toggleTransaction = function() {
    ctrl.showSplits = !ctrl.showSplits;
  };

  ctrl.updateTransaction = function() {
    TransactionService.update(ctrl.transaction);
  };

  ctrl.addSplit = function() {
    TransactionService.addSplit(ctrl.transaction.id, ctrl.newSplit.destAccountId, ctrl.newSplit.inValue-ctrl.newSplit.outValue, ctrl.newSplit.convertRate, ctrl.newSplit.description).then(function() {
      ctrl.resetForm();
    });
  };

  ctrl.resetForm = function() {
    ctrl.newSplit.inValue = 0;
    ctrl.newSplit.outValue = 0;
    ctrl.newSplit.description = "";
    ctrl.newSplit.destAccountId = undefined;
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
