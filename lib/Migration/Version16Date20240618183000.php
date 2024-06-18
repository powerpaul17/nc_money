<?php

declare(strict_types=1);

namespace OCA\Money\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

class Version16Date20240618183000 extends SimpleMigrationStep {

  /**
   * @param IOutput $output
   * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
   * @param array $options
   * @return null|ISchemaWrapper
   */
  public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
    $schema = $schemaClosure();

    $accountsTable = $schema->getTable('money_accounts');
    $accountsTable->addIndex(['book_id'], 'money_accounts_book_id_idx');

    $transactionsTable = $schema->getTable('money_transactions');
    $transactionsTable->addIndex(['date'], 'money_transactions_date_idx');

    $splitsTable = $schema->getTable('money_splits');
    $splitsTable->addIndex(['transaction_id'], 'money_splits_transaction_id_idx');
    $splitsTable->addIndex(['dest_account_id'], 'money_splits_dest_account_id_idx');

    return $schema;
  }

}
