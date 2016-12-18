angular.module('moneyApp')
.service('accountService', function($http) {

  var ctrl = this;

  ctrl.getAccounts = function() {
    return $http.get('ajax/get-accounts').then(function(response) {
  		return response.data;
  	});
  };

});
