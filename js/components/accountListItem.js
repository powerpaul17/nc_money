angular.module('moneyApp')
.controller('accountListItemCtrl', function($route, $routeParams) {
  var ctrl = this;
  
  ctrl.openAccount = function() {
    $route.updateParams({
      tid: $routeParams.tid,
      aid: ctrl.account.id
    });
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
