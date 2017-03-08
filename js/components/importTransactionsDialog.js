angular.module('moneyApp')
.controller('importTransactionsDialogCtrl', function($scope, $uibModalInstance, TransactionService) {

  var ctrl = this;

  ctrl.t = {
    closeButtonText: t('money', 'Cancel'),
    actionButtonText: t('money', 'Import transactions'),
    headerText: t('money', 'Import transactions...')
  };

  ctrl.availableColumns = [];
  // ctrl.dateColumn = 0;
  // ctrl.descriptionColumn = 0;
  // ctrl.commentColumn = 0;
  // ctrl.inValueColumn = 0;
  // ctrl.outValueColumn = 0;

  ctrl.availableSeparators = [
    ',',
    ';',
    '\t',
    '","'
  ];
  ctrl.columnSeparator = 3; // ","

  ctrl.newTransactions = [];

  // Return array of string values, or NULL if CSV string not well formed.
ctrl.CSVtoArray = function(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
};

  ctrl.splitRowsIntoColumns = function(fileRows) {
    for(var i = 0; i < fileRows.length; i++) {
      // fileRows[i] = fileRows[i].split(ctrl.availableSeparators[ctrl.columnSeparator]);
      fileRows[i] = ctrl.CSVtoArray(fileRows[i]);
    }
  };

  var reader = new FileReader();

  reader.onloadend = function() {
    ctrl.fileRows = reader.result.split('\n');
    if(ctrl.fileRows.length > 0) {
      ctrl.splitRowsIntoColumns(ctrl.fileRows);

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
          }
        }
      }
    }
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
    ctrl.normalizeValues(ctrl.fileRows);
    ctrl.newTransactions.length = 0;
    // Build transaction list
    for(var i = 0; i < ctrl.fileRows.length; i++) {
      // console.log(Date.parse(ctrl.fileRows[i][ctrl.dateColumn]));
      if (
        (!isNaN(Date.parse(ctrl.fileRows[i][ctrl.dateColumn]))) &&
        (!isNaN(ctrl.fileRows[i][ctrl.inValueColumn]))
      ) {
        ctrl.newTransactions.push(
          {
            srcAccountId: $scope.account.id,
            destAccountId: -1,
            value: -ctrl.fileRows[i][ctrl.inValueColumn], // - ctrl.fileRows[i][ctrl.outValueColumn],
            convertRate: 1,
            date: ctrl.fileRows[i][ctrl.dateColumn],
            description: ctrl.fileRows[i][ctrl.descriptionColumn],
            srcSplitComment: ctrl.fileRows[i][ctrl.commentColumn]
          }
        );
      }
    }

console.log(ctrl.newTransactions);

    TransactionService.createBatch(ctrl.newTransactions).then(function() {
      alert("Bing!!");
    });

    $uibModalInstance.close();
  };

  ctrl.close = function() {
    $uibModalInstance.dismiss('cancel');
  };

});
