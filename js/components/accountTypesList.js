angular.module('moneyApp')
.controller('accountTypesListCtrl', function($scope, $routeParams, ACCOUNT_TYPES) {
	var ctrl = this;

	ctrl.types = ACCOUNT_TYPES;

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
