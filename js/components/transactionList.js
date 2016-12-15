angular.module('moneyApp')
.controller('transactionListController', function($scope, $http, $route, $routeParams) {

	var ctrl = this;

	// Get transactions
	// $http.get('ajax/get-transactions').then(function(response) {
	// 	ctrl.transactions = response.data;
	// });

	$scope.getCountString = function(transactions) {
		return n('money', '%n transaction', '%n transactions', transactions.length);
	}

})
.component('transactionList', {
		controller: 'transactionListController',
		controllerAs: 'ctrl',
		templateUrl: OC.linkTo('money', 'templates/transactionList.html')
});
