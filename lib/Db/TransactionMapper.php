<?php

namespace OCA\Money\Db;

use OCP\IDb;
use OCP\AppFramework\Db\Mapper;

class TransactionMapper extends Mapper {

  public function __construct(IDb $db) {
    parent::__construct($db, 'money_transactions', '\OCA\Money\Db\Transaction');
  }

  public function find($id, $userId) {
    $sql = 'SELECT * FROM *PREFIX*money_transactions WHERE id = ? AND user_id = ?';
    return $this->findEntity($sql, [$id, $userId]);
  }

  public function findAll($userId) {
    $sql = 'SELECT * FROM *PREFIX*money_transactions WHERE user_id = ?';
    return $this->findEntities($sql, [$userId]);
  }

  public function findAllTransactionsOfAccount($userId, $accountId) {
    /* Testing */
//    $sql = 'SELECT a.id, a.date, a.description, SUM(b.value) as value FROM (*PREFIX*money_transactions a LEFT JOIN *PREFIX*money_splits b ON (a.id = b.transaction_id)) WHERE a.user_id = ? AND b.dest_account_id = ? GROUP BY a.id';
    $sql = 'SELECT a.* FROM *PREFIX*money_transactions a LEFT JOIN *PREFIX*money_splits b ON (a.id = b.transaction_id) WHERE a.user_id = ? AND b.dest_account_id = ? GROUP BY a.id';
    return $this->findEntities($sql, [$userId, $accountId]);
  }

}

?>
