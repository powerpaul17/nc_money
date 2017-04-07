<?php
/**
 * Nextcloud - money
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Paul Tirk <paultirk@paultirk.com>
 * @copyright Paul Tirk 2016
 */

namespace OCA\Money\AppInfo;

use OCP\AppFramework\App;

$app = new App('money');
$container = $app->getContainer();

$container->query('OCP\INavigationManager')->add(function () use ($container) {
	$urlGenerator = $container->query('OCP\IURLGenerator');
	$l10n = $container->query('OCP\IL10N');
	return [
		// the string under which your app will be referenced in owncloud
		'id' => 'money',

		// sorting weight for the navigation. The higher the number, the higher
		// will it be listed in the navigation
		'order' => 4,

		// the route that will be shown on startup
		'href' => $urlGenerator->linkToRoute('money.page.index'),

		// the icon that will be shown in the navigation
		// this file needs to exist in img/
		'icon' => $urlGenerator->imagePath('money', 'money.svg'),

		// the title of your application. This will be used in the
		// navigation or on the settings page of your app
		'name' => $l10n->t('Money'),
	];
});

// \OCP\App::registerPersonal('money', 'lib/personal');
