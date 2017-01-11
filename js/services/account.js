angular.module('moneyApp')
.service('AccountService', function($http, CacheFactory, $q) {

  var ctrl = this;

  var cacheFilled = false;
  var accounts = CacheFactory('accounts');
  var loadPromise = undefined;

  var observerCallbacks = [];

  ctrl.registerObserverCallback = function(callback) {
    observerCallbacks.push(callback);
  };

  var notifyObservers = function(eventname, accountId) {
    var ev = {
      event: eventname,
      accountId: accountId
    };
    angular.forEach(observerCallbacks, function(callback) {
      callback(ev);
    });
  };

  ctrl.fillCache = function() {
    if (_.isUndefined(loadPromise)) {
      loadPromise = $http.get('ajax/get-accounts').then(function(response) {
      	//ctrl.accounts = response.data;
        for (var i in response.data) {
          accounts.put(response.data[i].id, response.data[i]);
        }
        cacheFilled = true;
      });
    }
    return loadPromise;
  };

  ctrl.getAccounts = function() {
    if (cacheFilled === false) {
      return this.fillCache().then(function() {
        return accounts.values();
      });
    } else {
      return $q.when(accounts.values());
    }
  };

  ctrl.getAccountById = function(accountId) {
    if (cacheFilled === false) {
      return this.fillCache().then(function() {
        return accounts.get(accountId);
      });
    } else {
      return $q.when(accounts.get(accountId));
    }
  };

  // Get individual account from server
  // ctrl.getById = function(aid) {
  //   return $http.get('ajax/get-account', {
  //     params: {
  //       accountId: aid
  //     }
  //   }).then(function(response) {
  //     return response.data;
  //   });
  // };

  ctrl.getCurrencies = function() {
    return this.getAccounts().then(function(accounts) {
      return _.uniq(accounts.map(function(element) {
        return element.currency;
      }).reduce(function(a, b) {
        return a.concat(b);
      }, []).sort(), true);
    });
  };

  ctrl.update = function(account) {
    return $http.put('ajax/update-account', account).then(function(response) {
      notifyObservers('update', account.id);
    });
  };

  ctrl.create = function(account) {
    return $http.post('ajax/add-account', account).then(function(response) {
      notifyObservers('create', response.data.id)
    });
  };

  ctrl.getAccountBalance = function(accountId) {
    return $http.get('ajax/get-account-balance', {
      params: {
        accountId: accountId
      }
    }).then(function(response) {
      return response.data;
    });
  };

  ctrl.getAccountTypeBalance = function(accountType) {
    // TODO
  };

});
