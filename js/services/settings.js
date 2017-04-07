angular.module('moneyApp')
.service('SettingsService', function($http, CacheFactory) {

  var ctrl = this;

  var settingsCache;
  if (!CacheFactory.get('settingsCache')) {
    settingsCache = CacheFactory('settingsCache');
  }

  var observerCallbacks = [];

  ctrl.registerObserverCallback = function(callback) {
    observerCallbacks.push(callback);
  };

  var notifyObservers = function(eventname, response) {
    var ev = {
      event: eventname,
      response: response
    };
    angular.forEach(observerCallbacks, function(callback) {
      callback(ev);
    });
  };

  ctrl.getAccountSummaryCurrency = function() {
    if (settingsCache.get('accountSummaryCurrency')) {
      return $q.when(settingsCache.get('accountSummaryCurrency'));
    } else {
      return $http.get('config', {
        params: {
          key: 'accountSummaryCurrency'
        }
      }).then(function(response) {
        settingsCache.put('accountSummaryCurrency', response.data.value);
        return response.data.value;
      });
    }
  };

  ctrl.setAccountSummaryCurrency = function(accountSummaryCurrency) {
    return $http.post('config', {
      key: 'accountSummaryCurrency',
      value: accountSummaryCurrency
    }).then(function(response) {
      settingsCache.put('accountSummaryCurrency', accountSummaryCurrency);
      notifyObservers('accountSummaryCurrencyChanged', accountSummaryCurrency);
      return accountSummaryCurrency;
    });
  };

});
