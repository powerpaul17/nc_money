angular.module('moneyApp')
.controller('settingsCtrl', function($scope, $route, $routeParams, SettingsService, AccountService) {
  var ctrl = this;

  ctrl.updateAccountSummaryCurrency = function() {
    SettingsService.setAccountSummaryCurrency(ctrl.accountSummaryCurrency);
  }

});
