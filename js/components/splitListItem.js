angular.module('moneyApp')
.controller('splitListItemCtrl', function($http, AccountService, TransactionService) {
  var ctrl = this;

  // we save a copy before someone edits the form
  ctrl.originalSplit = angular.copy(ctrl.split);

  AccountService.getAccounts().then(function(accounts) {
    ctrl.availableAccounts = _.unique(accounts);
  });

  ctrl.resetForm = function() {
    ctrl.splitForm.$setPristine();
    ctrl.splitForm.$setUntouched();
  }

  ctrl.deleteSplit = function() {
    ctrl.splitItemLoading = true;
    TransactionService.deleteSplit(ctrl.split.id).then(function(response) {
      ctrl.splitItemLoading = false;
    });
  };

  ctrl.updateSplit = function() {
    ctrl.splitItemLoading = true;

    if ((ctrl.split.inValue !== ctrl.originalSplit.inValue) || (ctrl.split.outValue !== ctrl.originalSplit.outValue)) {
      ctrl.split.shownValue = ctrl.split.inValue - ctrl.split.outValue;
    }

    // Handle multiple currencies
    if (ctrl.split.foreignCurrency) {
      ctrl.split.value = ctrl.split.shownValue * ctrl.transaction.convertRate / ctrl.split.convertRate;
    } else {
      ctrl.split.value = ctrl.split.shownValue;
    }

    TransactionService.updateSplit(ctrl.split, ctrl.originalSplit.destAccountId, ctrl.originalSplit.value).then(function(response) {
      ctrl.originalSplit = angular.copy(ctrl.split);
      ctrl.resetForm();
      ctrl.splitItemLoading = false;
    });
  }
});

angular.module('moneyApp')
.directive('splitListItem', function() {
  return {
    scope: {},
    controller: 'splitListItemCtrl',
    controllerAs: 'ctrl',
    bindToController: {
      split: '<data',
      transaction: '<transaction'
    },
    replace: true,
    templateUrl: OC.linkTo('money', 'templates/splitListItem.html')
  };
});
