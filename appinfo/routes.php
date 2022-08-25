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

return [
  'resources' => [

  ],
  'routes' => [
    ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],

    ['name' => 'settings#get_config', 'url' => '/config', 'verb' => 'GET'],
    ['name' => 'settings#set_config', 'url' => '/config', 'verb' => 'POST'],

    ['name' => 'account#get_accounts', 'url' => '/accounts', 'verb' => 'GET'],
    ['name' => 'account#get_account', 'url' => '/accounts/{id}', 'verb' => 'GET'],
    ['name' => 'account#update_account', 'url' => '/accounts/{id}', 'verb' => 'PUT'],
    ['name' => 'account#add_account', 'url' => '/accounts', 'verb' => 'POST'],
    ['name' => 'account#delete_account', 'url' => '/accounts/{id}', 'verb' => 'DELETE'],

    ['name' => 'transaction#get_transactions_for_account', 'url' => '/transactions/get-transactions-for-account', 'verb' => 'GET'],
    ['name' => 'transaction#get_transactions_for_account_by_date', 'url' => '/transactions/get-transactions-for-account-by-date', 'verb' => 'GET'],

    ['name' => 'transaction#get_transaction', 'url' => '/transactions/{id}', 'verb' => 'GET'],
    ['name' => 'transaction#update_transaction', 'url' => '/transactions/{id}', 'verb' => 'PUT'],
    ['name' => 'transaction#add_transaction', 'url' => '/transactions', 'verb' => 'POST'],
    ['name' => 'transaction#add_simple_transaction', 'url' => '/transactions/add-simple-transaction', 'verb' => 'POST'],
    ['name' => 'transaction#add_split_transaction', 'url' => '/transactions/add-split-transaction', 'verb' => 'POST'],
    ['name' => 'transaction#add_transactions', 'url' => '/transactions/add-transactions', 'verb' => 'POST'],

    ['name' => 'split#get_splits_for_transaction', 'url' => '/splits/get-splits-for-transaction', 'verb' => 'GET'],
    ['name' => 'split#update_split', 'url' => '/splits/{id}', 'verb' => 'PUT'],
    ['name' => 'split#add_split', 'url' => '/splits', 'verb' => 'POST'],
    ['name' => 'split#delete_split', 'url' => '/splits/{id}', 'verb' => 'DELETE'],

    ['name' => 'account#get_account_balance', 'url' => '/accounts/get-account-balance', 'verb' => 'GET'],
    ['name' => 'transaction#get_unbalanced_transactions', 'url' => '/transactions/get-unbalanced-transactions', 'verb' => 'GET'],

//    ['name' => 'money_api#preflighted_cors', 'url' => '/api/v0.1/{path}', 'verb' => 'OPTIONS', 'requirements' => array('path' => '.+')],
  ]
];
