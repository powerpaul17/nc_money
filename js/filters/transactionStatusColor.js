angular.module('moneyApp')
.filter('transactionStatusColor', function(TRANSACTION_STATUS) {
  return function(input) {
    switch(input) {
      case TRANSACTION_STATUS.indexOf('BALANCED'):
        // return '#0f0';
        break;
      case TRANSACTION_STATUS.indexOf('UNBALANCED'):
        return 'rgb(255, 128, 0)';
        break;
      case TRANSACTION_STATUS.indexOf('FUTURE'):
        return 'rgb(0, 111, 255)';
        break;
      case TRANSACTION_STATUS.indexOf('UNDEFINED'):
      default:
        return '#ddd';
    }
  };
});
