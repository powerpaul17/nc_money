angular.module('moneyApp')
.directive('appPopoverMenu', function() {
  'use strict';
  return {
    restrict: 'C',
    link: function(scope, elm) {
      var menu = elm.find('.popovermenu');
      var button = elm.find('button');
      button.click(function(e) {
        // $('.popovermenu').addClass('hidden');
        menu.toggleClass('hidden');
        e.stopPropagation();
      });
      scope.$on('documentClicked', function(scope, event) {
        /* prevent closing popover if target has no-close class */
        if(event.target !== button && !$(event.target).hasClass('no-close')) {
          menu.addClass('hidden');
        }
        button.css('display', '');
      });
    }
  };
});
