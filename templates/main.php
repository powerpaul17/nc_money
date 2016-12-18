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
script('money', 'services/account');
script('money', 'services/search');
script('money', 'components/accountList');
//script('money', 'components/newAccountButton');
script('money', 'components/accountDetails');
script('money', 'components/transactionList');

// all styles
style('money', 'public/style');
vendor_style('select2/select2');
?>

<div id="app" ng-app="moneyApp">
	<div id="app-navigation">

		<new-account-button></new-account-button>
<!--		<ul account-list></ul> -->

		<!-- <div id="app-settings">
			<div id="app-settings-header">
				<button class="settings-button"
						data-apps-slide-toggle="#app-settings-content">
					<?php //p($l->t('Settings'));?>
				</button>
			</div>
			<div id="app-settings-content">
			</div>
		</div> -->
	</div>

	<div id="app-content">
		<div class="app-content-list" ng-controller="accountListController as ctrl">

			<div style="height: 90%" class="accounts-list" ng-class="{loading: ctrl.loading, 'mobile-show': ctrl.show}">
			  <div class="app-content-list-item"
				     ng-repeat="account in ctrl.accounts as filtered">
			    <a class="app-content-list-item-link" href="#{{account.id}}">
			      <div class="app-content-list-item-icon account__icon" ng-style="{'background-color': ( account.type | accountColor ) }">{{ account.name | firstCharacter }}</div>
			      <div class="app-content-list-item-star icon-star" data-starred="false"></div>
			      <div class="app-content-list-item-line-one" ng-class="{}">{{ account.name }}</div>
			      <div class="app-content-list-item-line-two">{{ account.currencyId }} &nbsp; {{ account }}</div>
			    </a>
				</div>
				<div ng-if="filtered.length>0" class="accounts-list-count">
					{{ getCountString(filtered) }}
				</div>
			</div>

		</div>
		<div class="app-content-detail" ng-view></div>
	</div>
</div>
