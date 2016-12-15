angular.module('moneyApp')
.controller('accountCtrl', function($route, $routeParams) {
	var ctrl = this;

	ctrl.openAccount = function() {
		alert("Jui");
		$route.updateParams({
			uid: ctrl.account.id()
		})
	};

});

angular.module('moneyApp')
.directive('account', function() {
	return {
		scope: {},
		controller: 'accountCtrl',
		controllerAs: 'ctrl',
		bindToController: {
//			group: '=data'
		},
		templateUrl: OC.linkTo('money', 'templates/account.html')
	};
});
