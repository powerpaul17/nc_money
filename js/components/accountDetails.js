angular.module('moneyApp')
.controller('accountDetailsCtrl', function($route, $routeParams, $scope, AccountService) {
  var ctrl = this;

  ctrl.account = undefined;

  ctrl.show = false;
  ctrl.showActionsPanel = false;

  ctrl.availableCurrencies = [];

  ctrl.t = {
    deleteAccount: t('money', 'Delete account'),
    exportAccount: t('money', 'Export account'),
    importTransactions: t('money', 'Import transactions'),
    noAccount: t('money', 'No account opened.'),
    placeholderName: t('money', 'Name'),
    placeholderCurrency: t('money', 'Currency'),
    placeholderDescription: t('money', 'Description'),
    download: t('money', 'Download'),
    delete: t('money', 'Delete'),
    newCurrency: t('money', 'New currency'),
  };

  AccountService.getCurrencies().then(function(currencies) {
    ctrl.availableCurrencies = currencies;
  });

  ctrl.closeAccount = function() {
    $route.updateParams({
      tid: $routeParams.tid,
      aid: undefined
    });
    ctrl.show = false;
    ctrl.account = undefined;
  }

  ctrl.accountId = $routeParams.aid;

  $scope.$watch('ctrl.accountId', function(newValue) {
    ctrl.changeAccount(newValue);
  });

  ctrl.changeAccount = function(accountId) {
    if (typeof accountId === 'undefined') {
      if ($routeParams.tid === 'Unbalanced') {
        ctrl.account = {};
        ctrl.account.id = 'Unbalanced';
        ctrl.account.name = 'Unbalanced Transactions';
        ctrl.account.description = 'Unbalanced Transactions';
        ctrl.account.editingEnabled = false;
        ctrl.show = true;
        $('#app-navigation-toggle').addClass('showdetails');
        return;
      } else {
        ctrl.show = false;
        $('#app-navigation-toggle').removeClass('showdetails');
        return;
      }
    } else {
      AccountService.getAccountById(accountId).then(function(account) {
        if (angular.isUndefined(account)) {
          ctrl.closeAccount();
          return;
        }
        ctrl.account = account;
        ctrl.account.editingEnabled = true;
        ctrl.show = true;
        $('#app-navigation-toggle').addClass('showdetails');
      });
    }
  };

  ctrl.toggleActionsPanel = function() {
    ctrl.showActionsPanel = !ctrl.showActionsPanel;
  };

  ctrl.updateAccount = function() {
    AccountService.update(ctrl.account);
  };

  ctrl.deleteAccount = function() {
    ctrl.deleteAccountLoading = true;
    AccountService.delete(ctrl.account);
  };

  ctrl.exportAccount = function() {

  };

  ctrl.importTransactions = function() {

  }

});

angular.module('moneyApp')
.directive('accountDetails', function() {
  return {
    priority: 1,
    scope: {},
    controller: 'accountDetailsCtrl',
    controllerAs: 'ctrl',
    bindToController: {},
    templateUrl: OC.linkTo('money', 'templates/accountDetails.html')
  };
});
