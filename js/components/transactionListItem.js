angular.module('moneyApp')
.controller('transactionListItemCtrl', function($route, $routeParams, TransactionService, AccountService) {
  var ctrl = this;

  AccountService.getAccounts().then(function(accounts) {
    ctrl.availableAccounts = _.unique(accounts);
  });

  ctrl.transaction.mutlipleSplits = false;

  // Initialize newSplit variable
  ctrl.newSplit = [];
  ctrl.newSplit.inValue = 0;
  ctrl.newSplit.outValue = 0;
  ctrl.newSplit.description = "";
  ctrl.newSplit.destAccountId = undefined;

  var value = 0;
  var destAccountCount = 0;
  for(var i = 0; i < ctrl.transaction.splits.length; i++) {
    if (parseInt(ctrl.transaction.splits[i].destAccountId) === parseInt(ctrl.account.id)) {
      value += ctrl.transaction.splits[i].value;
    } else {
      if(destAccountCount === 0) {
        ctrl.transaction.destAccountId = ctrl.transaction.splits[i].destAccountId;
        destAccountCount++;
      } else {
        ctrl.transaction.multipleSplits = true;
      }
    }
  }
  ctrl.transaction.value = value;

  ctrl.toggleTransaction = function() {
    ctrl.showSplits = !ctrl.showSplits;
  };

  ctrl.updateTransaction = function() {
    TransactionService.update(ctrl.transaction);
  };

  ctrl.addSplit = function() {
    TransactionService.addSplit(ctrl.transaction.id, ctrl.newSplit.destAccountId, ctrl.newSplit.inValue-ctrl.newSplit.outValue, ctrl.newSplit.convertRate, ctrl.newSplit.description);
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
