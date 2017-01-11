<?php

namespace OCA\Money\BackgroundJob;

use OC\BackgroundJob\TimedJob;

class CleanupDatabase extends TimedJob {

  public function __construct() {
    $this->interval = 60*15; // run every 15 minutes
  }

  /**
	 * Makes the background job do its work
	 *
	 * @param array $argument unused argument
	 */
  public function run($argument) {
    $connection = \OC::$server->getDatabaseConnection();
    $logger = \OC::$server->getLogger();

    // Remove orphaned splits (not belonging to any account or transaction)

    $sql = 'DELETE FROM *PREFIX*money_splits WHERE id IN (SELECT * FROM (SELECT a.id FROM *PREFIX*money_splits a WHERE NOT EXISTS (SELECT null FROM *PREFIX*money_transactions b WHERE a.transaction_id = b.id)) AS p)';
    $deletedEntries = $connection->executeUpdate($sql);
    $logger->debug("$deletedEntries orphaned split(s) deleted", ['app' => 'Money']);

    $sql = 'DELETE FROM *PREFIX*money_splits WHERE id IN (SELECT * FROM (SELECT a.id FROM *PREFIX*money_splits a WHERE NOT EXISTS (SELECT null FROM *PREFIX*money_accounts b WHERE a.dest_account_id = b.id)) AS p)';
    $deletedEntries = $connection->executeUpdate($sql);
    $logger->debug("$deletedEntries orphaned split(s) deleted", ['app' => 'Money']);

    // Remove orphaned transactions (without any splits)

    $sql = 'DELETE FROM *PREFIX*money_transactions WHERE id IN (SELECT * FROM (SELECT a.id FROM *PREFIX*money_transactions a WHERE NOT EXISTS (SELECT null FROM *PREFIX*money_splits b WHERE b.transaction_id = a.id)) AS p)';
    $deletedEntries = $connection->executeUpdate($sql);
    $logger->debug("$deletedEntries orphaned transaction(s) deleted", ['app' => 'Money']);
  }

}

?>
