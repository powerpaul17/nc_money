angular.module('moneyApp')
.controller('splitListItemCtrl', function($http, AccountService) {
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
    return $http.post('ajax/delete-split', {splitId: ctrl.split.id}).then(function(response) {
      // accounts.remove(account.id);
      // notifyObservers('delete', response.data);
    });
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
