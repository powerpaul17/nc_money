angular.module('moneyApp')
.directive('currencyInput', ['$filter', function($filter) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      if (!ctrl) return;

      ctrl.$parsers.unshift(function(data) {
        return parseFloat(data.replace(/[^\d|\-+|\.+]/g, ''));
      });

      ctrl.$formatters.unshift(function(data) {
        return $filter('currency')(data, '');
      });

      element.bind('blur', function(event) {
        var plainNumber = element.val().replace(/[^\d|\-+|\.+]/g, '');
        element.val($filter('currency')(plainNumber, ''));
      });
    }
  }
}]);
