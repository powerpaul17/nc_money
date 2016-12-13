<?php
/**
 * ownCloud - money
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Paul Tirk <paultirk@paultirk.com>
 * @copyright Paul Tirk 2016
 */

return [
  'resources' => [
    'money_api' => ['url' => '/api/v0.1/money']
  ],
  'routes' => [
    ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
    ['name' => 'money_api#preflighted_cors', 'url' => '/api/v0.1/{path}', 'verb' => 'OPTIONS', 'requirements' => array('path' => '.+')],

    ['name' => 'money_api#getaccounts', 'url' => '/api/v0.1/getaccounts', 'verb' => 'GET']
  ]
];
