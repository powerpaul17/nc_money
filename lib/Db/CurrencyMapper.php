<?php

namespace OCA\Money\Db;

use OCP\IDb;
use OCP\AppFramework\Db\Mapper;

class CurrencyMapper extends Mapper{

  public function __construct(IDb $db) {
    parent::__construct($db, 'money_currencies', '\OCA\Money\Db\Currency');
  }

  public function find($id, $userId) {
    $sql = 'SELECT * FROM *PREFIX*money_currencies WHERE id = ? AND user_id = ?';
    return $this->findEntity($sql, [$id, $userId]);
  }

  public function findAll($userId) {
    $sql = 'SELECT * FROM *PREFIX*money_currencies WHERE user_id =?';
    return $this->findEntities($sql, [$userId]);
  }

}

?>
