angular.module('moneyApp')
.controller('accountCtrl', function($route, $routeParams) {
	var ctrl = this;

	ctrl.openAccount = function() {
		$route.updateParams({
			uid: ctrl.account.uid()
		})
	};

});

angular.module('moneyApp')
.directive('account', function() {
	return {
		restrict: 'A', // has to be an attribute to work with core css
		scope: {},
		controller: 'accountCtrl',
		controllerAs: 'ctrl',
		bindToController: {
			group: '=data'
		},
		templateUrl: OC.linkTo('money', 'templates/account.html')
	};
});
