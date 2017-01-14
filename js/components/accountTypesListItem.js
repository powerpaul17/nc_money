angular.module('moneyApp')
.controller('accountTypesListItemCtrl', function(AccountService) {
  var ctrl = this;

  ctrl.balance = AccountService.getAccountTypeBalance(ctrl.type);

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
