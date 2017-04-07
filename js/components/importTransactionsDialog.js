angular.module('moneyApp')
.controller('importTransactionsDialogCtrl', function($scope, $uibModalInstance, TransactionService) {

  var ctrl = this;

  ctrl.t = {
    closeButtonText: t('money', 'Cancel'),
    actionButtonText: t('money', 'Import transactions'),
    headerText: t('money', 'Import transactions...'),
    columnSeparator: t('money', 'Column separator')
  };

  ctrl.availableColumns = [];

  ctrl.availableSeparators = [
    ',',
    ';',
    '\t'
  ];
  ctrl.columnSeparator = ','; // ,

  ctrl.dateFormat = 'yy-mm-dd'; // ISO date format

  ctrl.fileRows = [];
  ctrl.newTransactions = [];

  ctrl.changeSeparator = function() {
    if (reader.result) {
      ctrl.parseFile(reader.result);
    }
  }

  ctrl.parseFile = function(file) {
    ctrl.fileRows = $.csv.toArrays(file, { separator: ctrl.columnSeparator});
    ctrl.footerText = ctrl.fileRows.length + ' row(s) read.';
    if(ctrl.fileRows.length > 0) {

      for(var i = 0; i < ctrl.fileRows[0].length; i++) {
        ctrl.availableColumns.push(
          {
            id: i,
            lines: [
              ctrl.fileRows[0][i]
            ]
          }
        );
      }
      for(var i = 1; i < 5; i++) {
        for(var j = 0; j < ctrl.availableColumns.length; j++) {
          if(ctrl.fileRows[i][j]) {
            ctrl.availableColumns[j].lines.push(ctrl.fileRows[i][j]);
          } else {
            ctrl.availableColumns[j].lines.push('');
          }
        }
      }
    }
  };

  ctrl.reformatDate = function(date) {
    // TODO
    // return Date.parse(date);
    try {
      return $.datepicker.parseDate(ctrl.dateFormat, date)
    } catch(err) {
      return undefined;
    }
  };

  var reader = new FileReader();

  reader.onloadend = function() {
    ctrl.parseFile(reader.result);
  };

  // Read file
  if ($scope.file) {
    reader.readAsText($scope.file);
  }

  ctrl.normalizeValues = function(rows) {
    for(var i = 0; i < rows.length; i++) {
      rows[i][ctrl.inValueColumn] = parseFloat(rows[i][ctrl.inValueColumn]);
      rows[i][ctrl.outValueColumn] = parseFloat(rows[i][ctrl.outValueColumn]);
    }
  };

  ctrl.ok = function() {
    ctrl.loading = true;
    ctrl.normalizeValues(ctrl.fileRows);
    ctrl.newTransactions.length = 0;
    ctrl.startDate = '';
    ctrl.endDate = '';
    // Build transaction list
    for(var i = 0; i < ctrl.fileRows.length; i++) {
      var parsedDate = ctrl.reformatDate(ctrl.fileRows[i][ctrl.dateColumn]);
      if (
        (parsedDate) &&
        (!isNaN(ctrl.fileRows[i][ctrl.inValueColumn]))
      ) {
        ctrl.newTransactions.push(
          {
            srcAccountId: $scope.account.id,
            destAccountId: -1,
            value: -ctrl.fileRows[i][ctrl.inValueColumn], // - ctrl.fileRows[i][ctrl.outValueColumn],
            convertRate: 1,
            date: $.datepicker.formatDate('yy-mm-dd', parsedDate),
            description: ctrl.fileRows[i][ctrl.descriptionColumn],
            srcSplitComment: ctrl.fileRows[i][ctrl.commentColumn]
          }
        );
        ctrl.footerText = ctrl.newTransactions.length + ' transaction(s) to import. Removing duplicates...';
        if((parsedDate < Date.parse(ctrl.startDate)) || (ctrl.startDate == '')) {
          ctrl.startDate = $.datepicker.formatDate('yy-mm-dd', parsedDate);
        }
        if((parsedDate > Date.parse(ctrl.endDate)) || (ctrl.endDate == '')) {
          ctrl.endDate = $.datepicker.formatDate('yy-mm-dd', parsedDate);
        }
      }
    }

    ctrl.footerText = ctrl.newTransactions.length + ' transaction(s) to import. Removing duplicates...';

    TransactionService.getTransactionsForAccountByDate($scope.account, ctrl.startDate, ctrl.endDate).then(function(transactions) {

      // Filter out duplicates
      var transactionsHashmap = [];
      for (var i = 0; i < transactions.length; i++) {
        transactionsHashmap[transactions[i].date + transactions[i].description + (transactions[i].inValue-transactions[i].outValue)] = 1;
      }
      for (var i = ctrl.newTransactions.length-1; i >= 0; i--) {
        if (transactionsHashmap[ctrl.newTransactions[i].date + ctrl.newTransactions[i].description + (-ctrl.newTransactions[i].value)]) {
          ctrl.newTransactions.splice(i,1);
        }
      }

      if (ctrl.newTransactions.length > 0) {
        ctrl.footerText = 'Importing ' + ctrl.newTransactions.length + ' transaction(s)...';
        TransactionService.createBatch(ctrl.newTransactions, $scope.account.id).then(function() {
          $uibModalInstance.close();
        });
      } else {
        $uibModalInstance.close();
      }
    });

  };

  ctrl.close = function() {
    $uibModalInstance.dismiss('cancel');
  };

});
