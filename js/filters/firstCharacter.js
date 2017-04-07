angular.module('moneyApp')
.filter('firstCharacter', function() {
  return function(input) {
    return input.charAt(0);
  };
});
