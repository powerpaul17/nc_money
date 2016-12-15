<?php

namespace OCA\Money\Db;

use OCP\IDb;
use OCP\AppFramework\Db\Mapper;

class SplitMapper extends Mapper {

  public function __construct(IDb $db) {
    parent::__construct($db, 'money_splits', '\OCA\Money\Db\Split');
  }

  public function find($id, $userId) {
    $sql = 'SELECT * FROM *PREFIX*money_splits WHERE id = ? AND user_id = ?';
    return $this->findEntity($sql, [$id, $userId]);
  }

  public function findAll($userId) {
    $sql = 'SELECT * FROM *PREFIX*money_splits WHERE user_id = ?';
    return $this->findEntities($sql, [$userId]);
  }

}

?>
