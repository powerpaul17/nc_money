angular.module('moneyApp')
.service('SettingsService', function($http) {

  var ctrl = this;

  ctrl.getAccountSummaryCurrency = function() {
    return $http.get('get-config', {
      params: {
        key: 'accountSummaryCurrency'
      }
    }).then(function(response) {
      return response.data.value;
    });
  };

  ctrl.setAccountSummaryCurrency = function(accountSummaryCurrency) {
    return $http.post('set-config', {
      data: {
        key: 'accountSummaryCurrency',
        value: accountSummaryCurrency
      }
    }).then(function() {
      return true;
    });
  };

});
