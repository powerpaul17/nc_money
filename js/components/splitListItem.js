angular.module('moneyApp')
.controller('splitListItemCtrl', function() {
  var ctrl = this;

});

angular.module('moneyApp')
.directive('splitListItem', function() {
  return {
    scope: {},
    controller: 'splitListItemCtrl',
    controllerAs: 'ctrl',
    bindToController: {
      split: '=data'
    },
    templateUrl: OC.linkTo('money', 'templates/splitListItem.html')
  };
});
