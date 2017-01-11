angular.module('moneyApp')
.controller('transactionListItemCtrl', function($route, $routeParams) {
  var ctrl = this;

  ctrl.openTransaction = function() {

  };

});

angular.module('moneyApp')
.directive('transactionListItem', function() {
  return {
    scope: {},
    controller: 'transactionListItemCtrl',
    controllerAs: 'ctrl',
    bindToController: {
      transaction: '=data'
    },
    templateUrl: OC.linkTo('money', 'templates/transactionListItem.html')
  };
});
