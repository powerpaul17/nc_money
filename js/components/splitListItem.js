angular.module('moneyApp')
.controller('splitListItemCtrl', function($http, AccountService, TransactionService) {
  var ctrl = this;

  AccountService.getAccounts().then(function(accounts) {
    ctrl.availableAccounts = _.unique(accounts);
  });

  // ctrl.split.inValue = 0;
  // ctrl.split.outValue = 0;
  //
  // if(ctrl.split.value > 0) {
  //   ctrl.split.inValue = ctrl.split.value;
  // } else {
  //   ctrl.split.outValue = -ctrl.split.value;
  // }

  ctrl.resetForm = function() {
    // if(ctrl.split.value > 0) {
    //   ctrl.split.inValue = ctrl.split.value;
    // } else {
    //   ctrl.split.outValue = -ctrl.split.value;
    // }
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
    ctrl.split.value = ctrl.split.inValue - ctrl.split.outValue;
    TransactionService.updateSplit(ctrl.split).then(function(response) {
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
      split: '=data'
    },
    replace: true,
    templateUrl: OC.linkTo('money', 'templates/splitListItem.html')
  };
});
