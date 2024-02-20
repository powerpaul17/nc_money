<?php

namespace OCA\Money\tests\Migration;

include_once __DIR__ . '/AbstractMigrationTestCase.php';

class Version15Date20240102222000Test extends AbstractMigrationTestCase {

  public function testAddBookTable() {
    $this->assertFalse($this->schema->hasTable('money_books'));

    $this->migrationService->migrate('15Date20240102222000');
    $this->renewSchema();

    $this->assertTrue($this->schema->hasTable('money_books'));
    $table = $this->schema->getTable('money_books');

    $this->assertTrue($table->hasColumn('user_id'));
    $this->assertTrue($table->hasColumn('name'));
    $this->assertTrue($table->hasColumn('description'));
  }

  public function testAddBookIdColumnToAccountTable() {
    $this->assertTrue($this->schema->hasTable('money_accounts'));
    $table = $this->schema->getTable('money_accounts');

    $this->assertFalse($table->hasColumn('book_id'));

    $this->migrationService->migrate('15Date20240102222000');
    $this->renewSchema();

    $table = $this->schema->getTable('money_accounts');
    $this->assertTrue($table->hasColumn('book_id'));
  }

  public function testAddBooksForUsers() {
    $this->assertTrue($this->schema->hasTable('money_accounts'));

    $qb = self::$db->getQueryBuilder();
    $qb->insert('money_accounts')
      ->values([
        'user_id' => ':userId',
        'name' => ':name',
        'type' => ':type',
        'currency' => ':currency'
      ])
      ->setParameters([
        'userId' => 'testuser',
        'name' => 'Testname',
        'type' => 0,
        'currency' => 'EUR'
      ]);
      $qb->executeStatement();

    $this->migrationService->migrate('15Date20240102222000');
    $this->renewSchema();

    $qb = self::$db->getQueryBuilder();
    $qb->select('*')->from('money_books');
    $res = $qb->executeQuery();
    $books = $res->fetchAll();

    $this->assertEquals(1, count($books));
    $book = $books[0];

    $this->assertEquals('testuser', $book['user_id']);

    $qb = self::$db->getQueryBuilder();
    $qb->select('*')->from('money_accounts');
    $res = $qb->executeQuery();
    $accounts = $res->fetchAll();

    $this->assertEquals(1, count($accounts));
    $account = $accounts[0];

    $this->assertEquals($book['id'], $account['book_id']);
  }

  protected function getPreviousMigrationName(): ?string {
    return '14Date20231010133500';
  }

}
