angular.module('moneyApp')
.controller('newAccountButtonCtrl', function(AccountService, $route, $routeParams, ACCOUNT_TYPES) {
  var ctrl = this;

  ctrl.t = {
    addAccount: t('money', 'Add account')
  };

  ctrl.addAccount = function() {
    AccountService.create({
      name: '',
      type: ACCOUNT_TYPES.indexOf($routeParams.tid),
      currency: '',
      description: ''
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
