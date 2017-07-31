<?php

namespace OCA\Money\Db;

use OCP\IDBConnection;
use OCP\AppFramework\Db\Mapper;

class SplitMapper extends Mapper {

  public function __construct(IDBConnection $db) {
    parent::__construct($db, 'money_splits', '\OCA\Money\Db\Split');
  }

  public function find($id, $userId) {
    $sql = 'SELECT a.*, b.currency FROM *PREFIX*money_splits a LEFT JOIN *PREFIX*money_accounts b ON b.id = a.dest_account_id WHERE a.id = ? AND a.user_id = ?';
    return $this->findEntity($sql, [$id, $userId]);
  }

  public function findAll($userId) {
    $sql = 'SELECT a.*, b.currency FROM *PREFIX*money_splits a LEFT JOIN *PREFIX*money_accounts b ON b.id = a.dest_account_id WHERE a.user_id = ?';
    return $this->findEntities($sql, [$userId]);
  }

  /* Testing */

  public function findAllSplitsOfTransaction($userId, $transactionId) {
    $sql = 'SELECT a.*, b.currency FROM *PREFIX*money_splits a LEFT JOIN *PREFIX*money_accounts b ON b.id = a.dest_account_id WHERE a.user_id = ? AND a.transaction_id = ?';
    return $this->findEntities($sql, [$userId, $transactionId]);
  }

}

?>
