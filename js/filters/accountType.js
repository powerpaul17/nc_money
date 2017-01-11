angular.module('moneyApp')
.filter('accountTypeFilter', function(ACCOUNT_TYPES) {
  'use strict';
  return function (accounts, type) {
    if (typeof accounts === 'undefined') {
      return accounts;
    }
    var filter = [];
    if (accounts.length > 0) {
      for (var i = 0; i < accounts.length; i++) {
        if (ACCOUNT_TYPES.indexOf(type) === parseInt(accounts[i].type)) {
          filter.push(accounts[i]);
        }
      }
    }
    return filter;
  };
});
