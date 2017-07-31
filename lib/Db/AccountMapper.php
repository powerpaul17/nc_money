<?php

namespace OCA\Money\Db;

use OCP\IDBConnection;
use OCP\AppFramework\Db\Mapper;

class AccountMapper extends Mapper {

  public function __construct(IDBConnection $db) {
    parent::__construct($db, 'money_accounts', '\OCA\Money\Db\Account');
  }

  public function find($id, $userId) {
    $sql = 'SELECT * FROM *PREFIX*money_accounts WHERE id = ? AND user_id = ?';
    return $this->findEntity($sql, [$id, $userId]);
  }

  public function findAll($userId) {
    $sql = 'SELECT * FROM *PREFIX*money_accounts WHERE user_id = ?';
    return $this->findEntities($sql, [$userId]);
  }

}

?>
