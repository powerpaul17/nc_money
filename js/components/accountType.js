angular.module('moneyApp')
.controller('accountTypeCtrl', function(AccountService) {
  var ctrl = this;

  ctrl.balance = AccountService.getAccountTypeBalance(ctrl.type);

});

angular.module('moneyApp')
.directive('accountType', function() {
  return {
    restrict: 'A',
    scope: {},
    controller: 'accountTypeCtrl',
    controllerAs: 'ctrl',
    bindToController: {
      type: '=data'
    },
    templateUrl: OC.linkTo('money', 'templates/accountType.html')
  };
});
