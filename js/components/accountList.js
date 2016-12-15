angular.module('moneyApp')
.controller('accountListController', function($scope, $http, $route, $routeParams) {

	var ctrl = this;

	// Get accounts
	$http.get('ajax/get-accounts').then(function(response) {
		ctrl.accounts = response.data;
	});

	$scope.getCountString = function(accounts) {
		return n('money', '%n account', '%n accounts', accounts.length);
	}

})
.directive('accountList', function() {
	return {
		controller: 'accountListController',
		controllerAs: 'ctrl',
		templateUrl: OC.linkTo('money', 'templates/accountList.html')
	};
});
