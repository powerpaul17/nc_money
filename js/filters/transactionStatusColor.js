angular.module('moneyApp')
.filter('transactionStatusColor', function(TRANSACTION_STATUS) {
	return function(input) {
		switch(input) {
			case TRANSACTION_STATUS.indexOf('BALANCED'):
				// return '#0f0';
				break;
			case TRANSACTION_STATUS.indexOf('UNBALANCED'):
				return 'rgba(255, 255, 0, 0.2)';
				break;
			case TRANSACTION_STATUS.indexOf('FUTURE'):
				return 'rgba(0, 111, 255, 0.2)';
				break;
			case TRANSACTION_STATUS.indexOf('UNDEFINED'):
			default:
				return '#ddd';
		}
	};
});
