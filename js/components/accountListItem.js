angular.module('moneyApp')
.controller('accountListItemCtrl', function($route, $routeParams, AccountService) {
  var ctrl = this;

  ctrl.openAccount = function() {
    $route.updateParams({
      tid: $routeParams.tid,
      aid: ctrl.account.id
    });
  };

  ctrl.updateAccount = function() {
    AccountService.update(ctrl.account);
  };

  ctrl.deleteAccount = function() {
    ctrl.deleteAccountLoading = true;
    AccountService.delete(ctrl.account);
  };

  ctrl.getSelectedId = function() {
    return $routeParams.aid;
  };

});

angular.module('moneyApp')
.directive('accountListItem', function() {
  return {
    scope: {},
    controller: 'accountListItemCtrl',
    controllerAs: 'ctrl',
    bindToController: {
      account: '=data'
    },
    templateUrl: OC.linkTo('money', 'templates/accountListItem.html')
  };
});
