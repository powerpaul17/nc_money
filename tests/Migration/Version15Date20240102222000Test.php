<?php

namespace OCA\Money\tests\Migration;

include_once __DIR__ . '/AbstractMigrationTestCase.php';

class Version15Date20240102222000Test extends AbstractMigrationTestCase {

  public function testAddBookIdColumnToAccountTable() {
    $this->assertTrue($this->schema->hasTable('money_accounts'));
    // $this->assertFalse($this->schema->hasTable('money_books'));

    $this->migrationService->migrate('15Date20240102222000');
    $this->renewSchema();

    $table = $this->schema->getTable('money_accounts');
    $this->assertTrue($table->hasColumn('book_id'));

    // $this->assertTrue($this->schema->hasTable('money_books'));
  }

  public function testAddBookTable() {
    $this->assertFalse($this->schema->hasTable('money_books'));

    $this->migrationService->migrate('15Date20240102222000');
    $this->renewSchema();

    $this->assertTrue($this->schema->hasTable('money_books'));
  }

  public function testAddBooksForUsers() {
    $this->assertTrue($this->schema->hasTable('money_accounts'));

    $qb = self::$db->getQueryBuilder();
    $qb->insert('money_accounts')
      ->values([
        'name' => ':name',
        'type' => ':type',
        'currency' => ':currency'
      ])
      ->setParameters([
        'name' => 'Testname',
        'type' => 0,
        'currency' => 'EUR'
      ]);
      $qb->executeStatement();

    $this->migrationService->migrate('15Date20240102222000');
    $this->renewSchema();

    $table = $this->schema->getTable('money_accounts');

  }

  protected function getPreviousMigrationName(): ?string {
    return '14Date20231010133500';
  }

}
