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

	// $routeProvider.when('/:gid', {
	// 	template: '<contactdetails></contactdetails>'
	// });
	//
	// $routeProvider.when('/:gid/:uid', {
	// 	template: '<contactdetails></contactdetails>'
	// });

	$routeProvider.otherwise('/');

});
