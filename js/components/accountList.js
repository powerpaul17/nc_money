angular.module('moneyApp')
.controller('accountListCtrl', function($scope, $filter, $route, $routeParams, AccountService, SearchService) {
	var ctrl = this;

	ctrl.routeParams = $routeParams;

	ctrl.accountList = [];
	ctrl.searchTerm = '';
	ctrl.show = true;
	ctrl.invalid = false;

	ctrl.t = {
		emptySearch : t('money', 'No search result for {query}', {query: ctrl.searchTerm})
	};

	$scope.getCountString = function(accounts) {
		return n('accounts', '%n account', '%n accounts', accounts.length);
	};

	$scope.query = function(account) {
		return account.matches(SearchService.getSearchTerm());
	};

	SearchService.registerObserverCallback(function(ev) {
		if (ev.event === 'submitSearch') {
			var uid = !_.isEmpty(ctrl.accountList) ? ctrl.accountList[0].uid() : undefined;
			ctrl.setSelectedId(uid);
			$scope.$apply();
		}
		if (ev.event === 'changeSearch') {
			ctrl.searchTerm = ev.searchTerm;
			ctrl.t.emptySearch = t('accounts',
								   'No search result for {query}',
								   {query: ctrl.searchTerm}
								  );
			$scope.$apply();
		}
	});

	ctrl.loading = true;

	AccountService.registerObserverCallback(function(ev) {
		$scope.$apply(function() {
			if (ev.event === 'delete') {
				if (ctrl.accountList.length === 1) {
					$route.updateParams({
						uid: undefined
					});
				} else {
					for (var i = 0, length = ctrl.accountList.length; i < length; i++) {
						if (ctrl.accountList[i].uid() === ev.uid) {
							$route.updateParams({
								uid: (ctrl.accountList[i+1]) ? ctrl.accountList[i+1].uid() : ctrl.accountList[i-1].uid()
							});
							break;
						}
					}
				}
			}
			else if (ev.event === 'create') {
				$route.updateParams({
					uid: ev.uid
				});
			}
			ctrl.accounts = ev.accounts;
		});
	});

	// Get accounts
	AccountService.getAll().then(function(accounts) {
		if(accounts.length>0) {
			$scope.$apply(function() {
				ctrl.accounts = accounts;
			});
		} else {
			ctrl.loading = false;
		}
	});

	// Wait for ctrl.accountList to be updated, load the first account and kill the watch
	var unbindListWatch = $scope.$watch('ctrl.accountList', function() {
		if(ctrl.accountList && ctrl.accountList.length > 0) {
			// Check if a specific uid is requested
			if($routeParams.uid) {
				ctrl.accountList.forEach(function(account) {
					if(account.uid() === $routeParams.uid) {
						ctrl.setSelectedId($routeParams.uid);
						ctrl.loading = false;
					}
				});
			}
			// No account previously loaded, let's load the first of the list if not in mobile mode
			if(ctrl.loading && $(window).width() > 768) {
				ctrl.setSelectedId(ctrl.accountList[0].uid());
			}
			ctrl.loading = false;
			unbindListWatch();
		}
	});

	$scope.$watch('ctrl.routeParams.uid', function(newValue, oldValue) {
		// Used for mobile view to clear the url
		if(typeof oldValue != 'undefined' && typeof newValue == 'undefined' && $(window).width() <= 768) {
			// no account selected
			ctrl.show = true;
			return;
		}
		if(newValue === undefined) {
			// we might have to wait until ng-repeat filled the accountList
			if(ctrl.accountList && ctrl.accountList.length > 0) {
				$route.updateParams({
					uid: ctrl.accountList[0].uid()
				});
			} else {
				// watch for next accountList update
				var unbindWatch = $scope.$watch('ctrl.accountList', function() {
					if(ctrl.accountList && ctrl.accountList.length > 0) {
						$route.updateParams({
							uid: ctrl.accountList[0].uid()
						});
					}
					unbindWatch(); // unbind as we only want one update
				});
			}
		} else {
			// displaying account details
			ctrl.show = false;
		}
	});

	$scope.$watch('ctrl.routeParams.gid', function() {
		// we might have to wait until ng-repeat filled the accountList
		ctrl.accountList = [];
		// not in mobile mode
		if($(window).width() > 768) {
			// watch for next accountList update
			var unbindWatch = $scope.$watch('ctrl.accountList', function() {
				if(ctrl.accountList && ctrl.accountList.length > 0) {
					$route.updateParams({
						uid: ctrl.contactList[0].uid()
					});
				}
				unbindWatch(); // unbind as we only want one update
			});
		}
	});

	// Watch if we have an invalid account
	$scope.$watch('ctrl.accountList[0].displayName()', function(displayName) {
		ctrl.invalid = (displayName === '');
	});

	ctrl.hasAccounts = function () {
		if (!ctrl.accounts) {
			return false;
		}
		return ctrl.accounts.length > 0;
	};

	ctrl.setSelectedId = function (accountId) {
		$route.updateParams({
			uid: accountId
		});
	};

	ctrl.getSelectedId = function() {
		return $routeParams.uid;
	};

});

angular.module('moneyApp')
.directive('accountList', function() {
	return {
		priority: 1,
		//restrict: 'EA', // has to be an attribute to work with core css
		scope: {},
		controller: 'accountListCtrl',
		controllerAs: 'ctrl',
		bindToController: {},
		templateUrl: OC.linkTo('money', 'templates/accountList.html')
	};
});
