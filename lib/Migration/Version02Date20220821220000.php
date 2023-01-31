<?php

declare(strict_types=1);

namespace OCA\Money\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Auto-generated migration step: Please modify to your needs!
 */
class Version02Date20220821220000 extends SimpleMigrationStep {

  /**
   * @param IOutput $output
   * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
   * @param array $options
   * @return null|ISchemaWrapper
   */
  public function changeSchema(IOutput $output, Closure $schemaClosure, array $options) {
    /** @var ISchemaWrapper $schema */
    $schema = $schemaClosure();

    if (!$schema->hasTable('money_accounts')) {
      $table = $schema->createTable('money_accounts');

      $table->addColumn('id', 'bigint', [
        'autoincrement' => true,
        'notnull' => true,
        'length' => 8,
        'unsigned' => true
      ]);
      $table->addColumn('name', 'string', [
        'length' => 45,
        'default' => ''
      ]);
      $table->addColumn('type', 'smallint', [
        'unsigned' => true,
        'notnull' => true
      ]);
      $table->addColumn('currency', 'string', [
        'notnull' => true,
        'length' => 10
      ]);
      $table->addColumn('description', 'string', [
        'notnull' => false,
        'length' => 200,
        'default' => ''
      ]);
      $table->addColumn('user_id', 'string', [
        'notnull' => true,
        'length' => 64,
        'default' => ''
      ]);

      $table->setPrimaryKey(['id']);
      $table->addIndex(['user_id'], 'money_accounts_user_id_idx');
    }

    if(!$schema->hasTable('money_transactions')) {
      $table = $schema->createTable('money_transactions');

      $table->addColumn('id', 'bigint', [
        'autoincrement' => true,
        'notnull' => true,
        'length' => 8,
        'unsigned' => true
      ]);
      $table->addColumn('description', 'string', [
        'notnull' => false,
        'length' => 200,
        'default' => ''
      ]);
      $table->addColumn('date', 'date', [
        'notnull' => true
      ]);
      $table->addColumn('timestamp_added', 'bigint', [
        'notnull' => true
      ]);
      $table->addColumn('user_id', 'string', [
        'notnull' => true,
        'length' => 64,
        'default' => ''
      ]);

      $table->setPrimaryKey(['id']);
      $table->addIndex(['user_id'], 'money_transactions_user_id_idx');
    }

    if(!$schema->hasTable('money_splits')) {
      $table = $schema->createTable('money_splits');

      $table->addColumn('id', 'bigint', [
        'autoincrement' => true,
        'notnull' => true,
        'length' => 8,
        'unsigned' => true
      ]);
      $table->addColumn('transaction_id', 'bigint', [
        'notnull' => true,
        'length' => 8,
        'unsigned' => true
      ]);
      $table->addColumn('dest_account_id', 'bigint', [
        'notnull' => true,
        'length' => 8,
        'unsigned' => true
      ]);
      $table->addColumn('value', 'float', [
        'notnull' => true,
        'default' => 0.0
      ]);
      $table->addColumn('convert_rate', 'float', [
        'notnull' => true,
        'default' => 1.0
      ]);
      $table->addColumn('description', 'string', [
        'notnull' => false,
        'length' => 200,
        'default' => ''
      ]);
      $table->addColumn('user_id', 'string', [
        'notnull' => true,
        'length' => 64,
        'default' => ''
      ]);

      $table->setPrimaryKey(['id']);
      $table->addIndex(['user_id'], 'money_splits_user_id_idx');
    }

    return $schema;
  }

}
