<?php

namespace OCA\Money\Db;

use OCP\IDBConnection;
use OCP\AppFramework\Db\QBMapper;

class BookMapper extends QBMapper {

  public function __construct(IDBConnection $db) {
    parent::__construct($db, 'money_books', '\OCA\Money\Db\Book');
  }

  public function find($id, $userId) {
    $qb = $this->db->getQueryBuilder();
    $qb->select('*')
      ->from($this->tableName)
      ->where('id = :id')
      ->andWhere('user_id = :user_id')
      ->setParameter('id', $id)
      ->setParameter('user_id', $userId);

    return $this->findEntity($qb);
  }

  public function findAll($userId) {
    $qb = $this->db->getQueryBuilder();
    $qb->select('*')
      ->from($this->tableName)
      ->where('user_id = :user_id')
      ->setParameter('user_id', $userId);

    return $this->findEntities($qb);
  }

}

?>
