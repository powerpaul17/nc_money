<?php

namespace OCA\Money\tests\Migration;

include_once __DIR__ . '/AbstractMigrationTestCase.php';

class Version16Date20240618183000Test extends AbstractMigrationTestCase {

  public function testAddIndices() {
    $this->migrationService->migrate('16Date20240618183000');
    $this->renewSchema();

    $accountsTable = $this->schema->getTable('money_accounts');

    $this->assertTrue($accountsTable->hasIndex('money_accounts_book_id_idx'));

    $transactionsTable = $this->schema->getTable('money_transactions');

    $this->assertTrue($transactionsTable->hasIndex('money_transactions_date_idx'));

    $splitsTable = $this->schema->getTable('money_splits');

    $this->assertTrue($splitsTable->hasIndex('money_splits_transaction_id_idx'));
    $this->assertTrue($splitsTable->hasIndex('money_splits_dest_account_id_idx'));
  }

  protected function getPreviousMigrationName(): ?string {
    return '15Date20240102222000';
  }

}
