<?php
// angular + components
script('money', 'vendor/angular/angular');
script('money', 'vendor/angular-route/angular-route');
script('money', 'vendor/angular-uuid4/angular-uuid4');
script('money', 'vendor/angular-cache/dist/angular-cache');
script('money', 'vendor/angular-sanitize/angular-sanitize');
script('money', 'vendor/ui-select/dist/select');

script('money', 'vendor/angular-bootstrap/ui-bootstrap.min');
script('money', 'vendor/angular-bootstrap/ui-bootstrap-tpls.min');
script('money', 'vendor/jquery-timepicker/jquery.ui.timepicker');
script('money', 'vendor/clipboard/dist/clipboard.min');
script('money', 'vendor/ngclipboard/dist/ngclipboard.min');

// DAV libraries
//script('money', 'dav/dav');

// compiled version of app javascript
//script('money', 'public/script');
script('money', 'main');
script('money', 'filters/accountColor');
script('money', 'filters/firstCharacter');
script('money', 'filters/accountType');
script('money', 'services/account');
script('money', 'services/transaction');
//script('money', 'services/search');
script('money', 'components/accountTypesList');
script('money', 'components/accountType');
script('money', 'components/accountList');
script('money', 'components/accountListItem');
script('money', 'components/accountDetails');
script('money', 'components/transactionList');

// all styles
style('money', 'public/style');
vendor_style('select2/select2');
?>

<div id="app" ng-app="moneyApp">
	<div id="app-navigation">
		<ul account-types-list></ul>
		<div id="app-settings">
			<div id="app-settings-header">
				<button class="settings-button" data-apps-slide-toggle="#app-settings-content">
					Settings
				</button>
			</div>
			<div id="app-settings-content">

			</div>
		</div>
	</div>
	<div id="app-content">
		<div class="app-content-list">
			<account-list></account-list>
		</div>
		<div class="app-content-detail" ng-view></div>
	</div>
</div>
