angular.module('moneyApp')
.controller('accountTypesListCtrl', function($scope, $route, $routeParams, ACCOUNT_TYPES, AccountService, TransactionService) {
	var ctrl = this;

	ctrl.types = [];
	ctrl.unbalancedValue = 0;

	for (var i = 0; i < ACCOUNT_TYPES.length; i++) {
		var newType = {};
		newType.type = ACCOUNT_TYPES[i];
		newType.balance = 0;
		ctrl.types.push(newType);
		AccountService.getAccountTypeBalance(i).then(function(result) {
			ctrl.types[result.accountTypeId].balance = result.balance;
			ctrl.unbalancedValue += result.balance;
		});
	}

	TransactionService.registerObserverCallback(function(ev) {
		if (ev.event === 'create') {
			for(var i = 0; i < ev.response.splits.length; i++) {
				value = ev.response.splits[i].value;
				AccountService.getAccountById(ev.response.splits[i].destAccountId).then(function(account) {
					ctrl.types[account.type].balance += value;
					ctrl.unbalancedValue += value;
				});
			}
		} else if (ev.event === 'createBatch') {
			AccountService.getAccountById(ev.response.srcAccountId).then(function(account) {
				ctrl.types[account.type].balance += ev.response.totalValue;
				ctrl.unbalancedValue += ev.response.totalValue;
			});
		} else if (ev.event === 'addedSplit') {
			AccountService.getAccountById(ev.response.destAccountId).then(function(account) {
				ctrl.types[account.type].balance += ev.response.value;
				ctrl.unbalancedValue += ev.response.value;
			});
		} else if (ev.event === 'updatedSplit') {
			AccountService.getAccountById(ev.response.originalAccount).then(function(account) {
				ctrl.types[account.type].balance -= ev.response.originalValue;
				ctrl.unbalancedValue -= ev.response.originalValue;
			});
			AccountService.getAccountById(ev.response.destAccountId).then(function(account) {
				ctrl.types[account.type].balance += ev.response.value;
				ctrl.unbalancedValue += ev.response.value;
			});
		} else if (ev.event === 'deletedSplit') {
			AccountService.getAccountById(ev.response.destAccountId).then(function(account) {
				ctrl.types[account.type].balance -= ev.response.value;
				ctrl.unbalancedValue -= ev.response.value;
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
		$route.updateParams({
			tid: 'Unbalanced',
			aid: undefined
		});
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
