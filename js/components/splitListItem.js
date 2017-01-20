angular.module('moneyApp')
.controller('splitListItemCtrl', function($http, AccountService, TransactionService) {
  var ctrl = this;

  AccountService.getAccounts().then(function(accounts) {
    ctrl.availableAccounts = _.unique(accounts);
  });

  ctrl.split.inValue = 0;
  ctrl.split.outValue = 0;

  if(ctrl.split.value > 0) {
    ctrl.split.inValue = ctrl.split.value;
  } else {
    ctrl.split.outValue = -ctrl.split.value;
  }

  ctrl.deleteSplit = function() {
    TransactionService.deleteSplit(ctrl.split.id);
  };

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
    templateUrl: OC.linkTo('money', 'templates/splitListItem.html')
  };
});
