angular.module('moneyApp')
.controller('transactionListItemCtrl', function($route, $routeParams, TransactionService) {
  var ctrl = this;

  var value = 0;
  for(var i = 0; i < ctrl.transaction.splits.length; i++) {
    if (parseInt(ctrl.transaction.splits[i].destAccountId) === parseInt(ctrl.account.id)) {
      value += ctrl.transaction.splits[i].value;
    }
  }
  ctrl.transaction.value = value;

  ctrl.toggleTransaction = function() {
    ctrl.showSplits = !ctrl.showSplits;
  };

  ctrl.updateTransaction = function() {
    TransactionService.update(ctrl.transaction);
  }

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
