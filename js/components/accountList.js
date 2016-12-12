// ACCOUNT LIST

angular.module('moneyApp')
.directive('accountList', function() {
	return {
		restrict: 'EA', // has to be an attribute to work with core css
		scope: {},
		controller: 'acountListCtrl',
		controllerAs: 'ctrl',
		bindToController: {},
		templateUrl: OC.linkTo('money', 'templates/accountList.html')
	};
});

angular.module('moneyApp')
.controller('accountListCtrl', function($scope, AccountService, SearchService, $routeParams) {
	var ctrl = this;

	//var initialGroups = [t('money', 'All documents'), t('paperwork', 'Not labeled')];

	// ctrl.labels = initialLabels;
	//
	// DocumentService.getLabels().then(function(labels) {
	// 	ctrl.labels = _.unique(initialLabels.concat(labels));
	// });
	//
    AccountService.getAccounts().then(function(accounts) {
			ctrl.accounts = accounts;
		});

	 ctrl.getSelected = function() {
	 	return $routeParams.gid;
	 };

	// Update accountList on document add/delete/update
	ContactService.registerObserverCallback(function() {
		$scope.$apply(function() {
			// DocumentService.getAccounts().then(function(labels) {
			// 	ctrl.labels = _.unique(initialLabels.concat(labels));
			// });
		});
	});

	ctrl.setSelected = function (selectedAccount) {
		SearchService.cleanSearch();
		$routeParams.gid = selectedAccount;
	};
});
