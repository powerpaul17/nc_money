<?php

declare(strict_types=1);

namespace OCA\Money\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;
use OCP\DB\Types;
use OCP\IDBConnection;

class Version15Date20240102222000 extends SimpleMigrationStep {

  private IDBConnection $db;

  public function __construct(IDBConnection $db) {
    $this->db = $db;
  }

  /**
   * @param IOutput $output
   * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
   * @param array $options
   * @return null|ISchemaWrapper
   */
  public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
    $schema = $schemaClosure();

    if (!$schema->hasTable('money_books')) {
      $booksTable = $schema->createTable('money_books');

      $booksTable->addColumn('id', Types::BIGINT, [
        'autoincrement' => true,
        'notnull' => true,
        'length' => 8,
        'unsigned' => true
      ]);

      $booksTable->addColumn('user_id', Types::STRING, [
        'notnull' => true,
        'length' => 64,
        'default' => ''
      ]);

      $booksTable->addColumn('name', Types::STRING, [
        'length' => 45,
        'default' => ''
      ]);

      $booksTable->addColumn('description', Types::STRING, [
        'notnull' => false,
        'length' => 1024,
        'default' => ''
      ]);

      $booksTable->setPrimaryKey(['id']);
      $booksTable->addIndex(['user_id'], 'money_books_user_id_idx');
    }

    $accountsTable = $schema->getTable('money_accounts');

    if (!$accountsTable->hasColumn('book_id')) {
      $accountsTable->addColumn('book_id', Types::BIGINT, [
        // TODO: set this to true
        'notnull' => false,

        'length' => 8,
        'unsigned' => true
      ]);
    }

    return $schema;
  }

  /**
   * @param IOutput $output
   * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
   * @psalm-param Closure():ISchemaWrapper $schemaClosure
   * @param array $options
   */
  public function postSchemaChange(IOutput $output, \Closure $schemaClosure, array $options) {
    $qb = $this->db->getQueryBuilder();

    $qb->select('user_id')
      ->from('money_accounts')
      ->where('book_id is null')
      ->groupBy('user_id');

    $result = $qb->executeQuery();
    $rows = $result->fetchAll();

    foreach($rows as $row) {
      $userId = $row['user_id'];

      $qb->insert('money_books')
        ->setValue('user_id', ':user_id')
        ->setParameter('user_id', $userId);

      $result = $qb->executeStatement();
      $id = $qb->getLastInsertId();

      $qb->update('money_accounts')
        ->set('book_id', $qb->createNamedParameter($id))
        ->where('user_id = :user_id')
        ->andWhere('book_id is null')
        ->setParameter('user_id', $userId);

      $qb->executeStatement();
    }
  }

}
