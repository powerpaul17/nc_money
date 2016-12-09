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

	$routeProvider.otherwise('/' + t('money', 'Bla??'));

});

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
.controller('accountListCtrl', function($scope, DocumentService, SearchService, $routeParams) {
	var ctrl = this;

	//var initialGroups = [t('money', 'All documents'), t('paperwork', 'Not labeled')];

	// ctrl.labels = initialLabels;
	//
	// DocumentService.getLabels().then(function(labels) {
	// 	ctrl.labels = _.unique(initialLabels.concat(labels));
	// });
	//
	 ctrl.getSelected = function() {
	 	return $routeParams.gid;
	 };
	//
	// // Update accountList on document add/delete/update
	// ContactService.registerObserverCallback(function() {
	// 	$scope.$apply(function() {
	// 		DocumentService.getAccounts().then(function(labels) {
	// 			ctrl.labels = _.unique(initialLabels.concat(labels));
	// 		});
	// 	});
	// });

	ctrl.setSelected = function (selectedAccount) {
		SearchService.cleanSearch();
		$routeParams.gid = selectedAccount;
	};
});
