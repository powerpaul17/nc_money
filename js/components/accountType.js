angular.module('moneyApp')
.controller('accountTypeCtrl', function() {
  var ctrl = this;
});

angular.module('moneyApp')
.directive('accountType', function() {
  return {
    restrict: 'A',
    scope: {},
    controller: 'accountTypeCtrl',
    controllerAs: 'ctrl',
    bindToController: {
      type: '=data'
    },
    templateUrl: OC.linkTo('money', 'templates/accountType.html')
  };
});
