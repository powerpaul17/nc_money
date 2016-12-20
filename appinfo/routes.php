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
    ['name' => 'money_api#get_accounts', 'url' => '/ajax/get-accounts', 'verb' => 'GET'],
    ['name' => 'money_api#get_account', 'url' => '/ajax/get-account', 'verb' => 'GET'],
    ['name' => 'money_api#update_account', 'url' => '/ajax/update-account', 'verb' => 'PUT'],
    ['name' => 'money_api#get_transactions_for_account', 'url' => '/ajax/get-transactions-for-account', 'verb' => 'GET'],
    ['name' => 'money_api#get_splits_for_transaction', 'url' => '/ajax/get-splits-for-transaction', 'verb' => 'GET'],
    //    ['name' => 'money_api#get_currencies', 'url' => '/ajax/get-currencies', 'verb' => 'GET'],
//    ['name' => 'money_api#preflighted_cors', 'url' => '/api/v0.1/{path}', 'verb' => 'OPTIONS', 'requirements' => array('path' => '.+')],
  ]
];
