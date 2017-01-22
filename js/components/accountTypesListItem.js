angular.module('moneyApp')
.controller('accountTypesListItemCtrl', function(AccountService, ACCOUNT_TYPES) {
  var ctrl = this;

  AccountService.getAccountTypeBalance(ACCOUNT_TYPES.indexOf(ctrl.type)).then(function(balance) {
    ctrl.balance = balance;
  });

});

angular.module('moneyApp')
.directive('accountTypesListItem', function() {
  return {
    restrict: 'A',
    scope: {},
    controller: 'accountTypesListItemCtrl',
    controllerAs: 'ctrl',
    bindToController: {
      type: '=data'
    },
    templateUrl: OC.linkTo('money', 'templates/accountTypesListItem.html')
  };
});
