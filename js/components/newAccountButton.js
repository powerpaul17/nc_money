angular.module('moneyApp')
.directive('newAccountButton', function() {
	return {
		restrict: 'EA', // has to be an attribute to work with core css
		scope: {},
		controller: 'newAccountButtonCtrl',
		controllerAs: 'ctrl',
		bindToController: {},
		templateUrl: OC.linkTo('money', 'templates/newAccountButton.html')
	};
});

angular.module('moneyApp')
.controller('newAccountButtonCtrl', function($scope, AccountService, $routeParams) {
	var ctrl = this;

	ctrl.t = {
		addAccount : t('money', 'New account')
	};

	ctrl.createAccount = function() {
		// AccountService.create().then(function(account) {
		// 	['tel', 'adr', 'email'].forEach(function(field) {
		// 		var defaultValue = vCardPropertiesService.getMeta(field).defaultValue || {value: ''};
		// 		contact.addProperty(field, defaultValue);
		// 	} );
		// 	if ([t('contacts', 'All contacts'), t('contacts', 'Not grouped')].indexOf($routeParams.gid) === -1) {
		// 		contact.categories($routeParams.gid);
		// 	} else {
		// 		contact.categories('');
		// 	}
		// 	$('#details-fullName').focus();
		// });
	};
});
