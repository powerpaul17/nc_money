angular.module('moneyApp')
.controller('importTransasctionsCtrl', function(TransactionService) {
  var ctrl = this;

  // ctrl.import = ContactService.import.bind(TransationService);

});


angular.module('moneyApp')
.directive('importTransactions', function(TransactionService, ModalDialogService) {
  return {
    link: function(scope, element) {
      var importText = t('money', 'Import');
      scope.importText = importText;

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
          //TODO
        });
            // TransactionService.import.call(TransactionService, reader.result, file.type, null, function (progress) {
            // 	if (progress === 1) {
            // 		scope.importText = importText;
            // 	} else {
            // 		scope.importText = parseInt(Math.floor(progress * 100)) + '%';
            // 	}
          // });
        input.get(0).value = '';
      });
    },
    scope: {
      account: "=account"
    },
    templateUrl: OC.linkTo('money', 'templates/importTransactions.html')
  };
});
