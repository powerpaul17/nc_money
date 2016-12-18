angular.module('moneyApp')
.controller('accountListController', function($scope, $http, $route, $routeParams, accountService) {

	var ctrl = this;

	// Get accounts
	// $scope.accounts = accountService.getAccounts().then(function (result) {
	// 	console.log(result);
	// });
	$http.get('ajax/get-accounts').then(function(response) {
		ctrl.accounts = response.data;
	});

	$scope.getCountString = function(accounts) {
		return n('money', '%n account', '%n accounts', accounts.length);
	}

})
.component('accountList', {
		controller: 'accountListController',
		controllerAs: 'ctrl',
		templateUrl: OC.linkTo('money', 'templates/accountList.html')
});
