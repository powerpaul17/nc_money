angular.module('moneyApp')
.controller('accountTypesListCtrl', function($scope, $routeParams, ACCOUNT_TYPES, AccountService, TransactionService) {
	var ctrl = this;

	ctrl.types = [];

	for (var i = 0; i < ACCOUNT_TYPES.length; i++) {
		var newType = {};
		newType.type = ACCOUNT_TYPES[i];
		newType.balance = 0;
		ctrl.types.push(newType);
		AccountService.getAccountTypeBalance(i).then(function(result) {
			ctrl.types[result.accountTypeId].balance = result.balance;
	  });
	}

	TransactionService.registerObserverCallback(function(ev) {
		for (var i = 0; i < ctrl.types.length; i++) {
			AccountService.getAccountTypeBalance(i).then(function(result) {
		    ctrl.types[result.accountTypeId].balance = result.balance;
		  });
		}
  });

	ctrl.getSelected = function() {
		return $routeParams.tid;
	};

	ctrl.setSelected = function(selectedType) {
		$routeParams.tid = selectedType;
	};

	ctrl.showUnbalanced = function() {
		$routeParams.tid = 'Unbalanced';
		$routeParams.aid = undefined;
	};

	ctrl.getUnbalancedValue = function() {
		var sum = 0;
		for (var i = 0; i < ctrl.types.length; i++) {
			sum += ctrl.types[i].balance;
		}
		return sum;
	};

	ctrl.getEquity = function() {
		return ctrl.types[ACCOUNT_TYPES.indexOf('Assets')].balance + ctrl.types[ACCOUNT_TYPES.indexOf('Liabilities')].balance;
	}

});

angular.module('moneyApp')
.directive('accountTypesList', function() {
	return {
		restrict: 'EA', // has to be an attribute to work with core css
		scope: {},
		controller: 'accountTypesListCtrl',
		controllerAs: 'ctrl',
		bindToController: {},
		templateUrl: OC.linkTo('money', 'templates/accountTypesList.html')
	};
});
