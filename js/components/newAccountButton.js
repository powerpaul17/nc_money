angular.module('moneyApp')
.controller('newAccountButtonCtrl', function(AccountService, $route, $routeParams, ACCOUNT_TYPES) {
  var ctrl = this;

  ctrl.t = {
    addAccount: t('money', 'Add account'),
    newAccount: t('money', 'New account')
  };

  ctrl.addAccount = function() {
    AccountService.getCurrencies().then(function(currencies) {
      availableCurrencies = currencies;
      AccountService.create({
        name: ctrl.t.newAccount,
        type: ACCOUNT_TYPES.indexOf($routeParams.tid),
        currency: availableCurrencies[0],
        description: ''
      });
    });
  };

});

angular.module('moneyApp')
.directive('newAccountButton', function() {
  return {
    restrict: 'EA',
    scope: {},
    controller: 'newAccountButtonCtrl',
    controllerAs: 'ctrl',
    bindToController: {},
    templateUrl: OC.linkTo('money', 'templates/newAccountButton.html')
  };
});
