angular.module('moneyApp')
.directive('datepicker', function() {
  return {
    restrict: 'A',
    require : 'ngModel',
    link : function (scope, element, attrs, ngModelCtrl) {
      function updateFromUserInput() {
        var date = element.datepicker('getDate'),
          hours = 0,
          minutes = 0;

        var m = moment(date);
        m.hours(hours);
        m.minutes(minutes);
        m.seconds(0);

//        ngModelCtrl.$setViewValue(m);
      }

      $(function() {
        element.datepicker({
          dateFormat:'yy-mm-dd',
          minDate: null,
          maxDate: null,
          onSelect:function (date) {
            ngModelCtrl.$setViewValue(date);
            scope.$apply();
          },
          onClose: updateFromUserInput
        });
      });
    }
  };
});
