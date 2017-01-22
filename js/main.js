	/**
 * ownCloud - money
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Paul Tirk <paultirk@paultirk.com>
 * @copyright Paul Tirk 2016
 */

angular.module('moneyApp', ['uuid4', 'angular-cache', 'ngRoute', 'ui.bootstrap', 'ui.select', 'ngSanitize', 'ngclipboard'])
.config(function($routeProvider) {

	$routeProvider.when('/Unbalanced', {
		template: '<unbalanced-transactions></unbalanced-transactions>'
	});

	$routeProvider.when('/:tid', {
		template: '<account-details></account-details>'
	});

	$routeProvider.when('/:tid/:aid', {
		template: '<account-details></account-details>'
	});

	$routeProvider.otherwise({redirectTo: '/'});

});

// Account type constants (service)

angular.module('moneyApp')
.constant('ACCOUNT_TYPES', [
	'Assets',
	'Liabilities',
	'Incomes',
	'Expenses'
]);

// Transaction status constants (service)

angular.module('moneyApp')
.constant('TRANSACTION_STATUS', [
	'UNDEFINED',
	'BALANCED',
	'UNBALANCED'
]);
