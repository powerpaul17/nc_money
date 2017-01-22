angular.module('moneyApp')
.filter('transactionStatusColor', function(TRANSACTION_STATUS) {
	return function(input) {
		switch(input) {
			case TRANSACTION_STATUS.indexOf('BALANCED'):
				return '#0f0';
				break;
			case TRANSACTION_STATUS.indexOf('UNBALANCED'):
				return '#ff0';
				break;
			case TRANSACTION_STATUS.indexOf('UNDEFINED'):
			default:
				return '#ddd';
		}
	};
});
