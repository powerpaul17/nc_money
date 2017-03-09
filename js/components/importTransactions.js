angular.module('moneyApp')
.controller('importTransasctionsCtrl', function(TransactionService) {

  var ctrl = this;

});

angular.module('moneyApp')
.directive('importTransactions', function(TransactionService, ModalDialogService) {
  return {
    link: function(scope, element) {

      var input = element.find('input');
      input.bind('change', function() {
        var file = input.get(0).files[0];

        scope.file = file;

        var modalDefaults = {
          controller: 'importTransactionsDialogCtrl',
          controllerAs: 'ctrl',
          templateUrl: OC.linkTo('money', 'templates/importTransactionsDialog.html'),
          scope: scope
        }

        ModalDialogService.showModal(modalDefaults, {}).then(function(result) {

        });

        input.get(0).value = '';
      });
    },
    scope: {
      account: "=account"
    },
    templateUrl: OC.linkTo('money', 'templates/importTransactions.html')
  };
});
