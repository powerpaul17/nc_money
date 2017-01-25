angular.module('moneyApp')
.controller('accountTypesListItemCtrl', function() {
  var ctrl = this;
});

angular.module('moneyApp')
.directive('accountTypesListItem', function() {
  return {
    restrict: 'A',
    scope: {},
    controller: 'accountTypesListItemCtrl',
    controllerAs: 'ctrl',
    bindToController: {
      type: '=data'
    },
    templateUrl: OC.linkTo('money', 'templates/accountTypesListItem.html')
  };
});
