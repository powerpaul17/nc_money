angular.module('moneyApp')
.controller('settingsCtrl', function($scope, $route, $routeParams, SettingsService, AccountService) {
  var ctrl = this;

  ctrl.availableCurrencies = [];
  AccountService.getCurrencies().then(function(currencies) {
    ctrl.availableCurrencies = currencies;
  });

  SettingsService.getAccountSummaryCurrency().then(function(response) {
    ctrl.accountSummaryCurrency = response;
  });

  ctrl.updateAccountSummaryCurrency = function() {
    SettingsService.setAccountSummaryCurrency(ctrl.accountSummaryCurrency);
  }

});

angular.module('moneyApp')
.directive('settings', function() {
  return {
    controller: 'settingsCtrl',
    controllerAs: 'ctrl',
    templateUrl: OC.linkTo('money', 'templates/settings.html')
  };
});
