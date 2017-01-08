angular.module('moneyApp')
.service('TransactionService', function($http) {

  var ctrl = this;

  ctrl.getTransactionsForAccount = function(accountId) {
    return $http.get('ajax/get-transactions-for-account', {
      params: {
        accountId: accountId
      }
    }).then(function(response) {
  		return response.data;
  	});
  };

});
