angular.module('moneyApp')
.controller('unbalancedTransactionsCtrl', function($route, $routeParams, $scope, AccountService) {
  var ctrl = this;

  ctrl.loading = true;
  ctrl.show = false;

  ctrl.availableCurrencies = [];

  AccountService.getCurrencies().then(function(currencies) {
    ctrl.availableCurrencies = _.unique(currencies);
  });

  ctrl.closeAccount = function() {
    $route.updateParams({
      tid: $routeParams.tid,
      aid: undefined
    });
    ctrl.show = false;
    ctrl.account = undefined;
  }

  ctrl.t = {
    noAccount : t('money', 'No account opened.'),
    placeholderName : t('money', 'Name'),
    placeholderCurrency : t('money', 'Currency'),
    placeholderDescription : t('money', 'Description'),
    download : t('money', 'Download'),
    delete : t('money', 'Delete'),
    newCurrency: t('money', 'New currency'),
  };

});

angular.module('moneyApp')
.directive('unbalancedTransactions', function() {
  return {
    priority: 1,
    scope: {},
    controller: 'unbalancedTransactionsCtrl',
    controllerAs: 'ctrl',
    bindToController: {},
    templateUrl: OC.linkTo('money', 'templates/unbalancedTransactions.html')
  };
});
