angular.module('moneyApp')
.controller('importTransactionsPanelCtrl', function() {
  var ctrl = this;

  // ctrl.account = undefined;

  ctrl.show = false;

  ctrl.t = {

  };

  ctrl.openFile = function() {

  };

});

angular.module('moneyApp')
.directive('importTransactionsPanel', function() {
  return {
    priority: 1,
    scope: {},
    controller: 'importTransactionsPanelCtrl',
    controllerAs: 'ctrl',
    bindToController: {
      account: '=account'
    },
    templateUrl: OC.linkTo('money', 'templates/importTransactionsPanel.html')
  };
});
