angular.module('moneyApp')
.controller('accountDetailsController', function($scope, $route, $routeParams, $http) {

	var ctrl = this;

  ctrl.accountId = $routeParams.accountId;

  ctrl.t = {
    noAccounts: t('money', 'No account in here')
  };

	$scope.$watch('ctrl.accountId', function(newValue) {
		ctrl.changeAccount(newValue);
	});

	ctrl.changeAccount = function(accountId) {
		$http.get('ajax/get-account', {
			'params' : {'accountId': accountId}
		}).then(function(response) {
			ctrl.account = response.data;
		});
	};

	ctrl.updateAccount = function() {
		// $http.get('ajax/update-account', {
		//
		// }).then(function(response) {
		//
		// });
	};

	// Get transactions
	// $http.get('ajax/get-accounts').then(function(response) {
	// 	self.accounts = response.data;
	// });

})
.directive('accountDetails', function() {
	return {
		controller: 'accountDetailsController',
		controllerAs: 'ctrl',
		templateUrl: OC.linkTo('money', 'templates/accountDetails.html')
	};
});
