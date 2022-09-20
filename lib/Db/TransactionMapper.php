<?php

namespace OCA\Money\Db;

use OCP\IDBConnection;
use OCP\AppFramework\Db\QBMapper;

class TransactionMapper extends QBMapper {

  public function __construct(IDBConnection $db) {
    parent::__construct($db, 'money_transactions', '\OCA\Money\Db\Transaction');
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
      ->where('user_id = :use_id')
      ->setParameter('user_id', $userId);

    return $this->findEntities($qb);
  }

  public function findAllTransactionsOfAccount($userId, $accountId, $resultOffset = 0, $resultLimit = 50) {
    $qb = $this->db->getQueryBuilder();
    $qb->select('a.*')
      ->from($this->tableName, 'a')
      ->leftJoin('a', 'money_splits', 'b', 'a.id = b.transaction_id')
      ->where('a.user_id = :user_id')
      ->andWhere('b.dest_account_id = :account_id')
      ->groupBy('a.id')
      ->orderBy('a.date', 'DESC')
      ->addOrderBy('a.timestamp_added', 'DESC')
      ->addOrderBy('a.id', 'DESC')
      ->setFirstResult($resultOffset)
      ->setMaxResults($resultLimit)
      ->setParameter('user_id', $userId)
      ->setParameter('account_id', $accountId);

    return $this->findEntities($qb);
  }

  public function findAllTransactionsOfAccountByDate($userId, $accountId, $startDate, $endDate) {
    $qb = $this->db->getQueryBuilder();
    $qb->select('a.*')
      ->from($this->tableName, 'a')
      ->leftJoin('a', 'money_splits', 'b', 'a.id = b.transaction_id')
      ->where('a.user_id = :user_id')
      ->andWhere('b.dest_account_id = :account_id')
      ->andWhere('a.date >= :start_date')
      ->andWhere('a.date <= :end_date')
      ->groupBy('a.id')
      ->orderBy('a.date', 'DESC')
      ->addOrderBy('a.timestamp_added', 'DESC')
      ->addOrderBy('a.id' ,'DESC')
      ->setParameter('user_id', $userId)
      ->setParameter('account_id', $accountId)
      ->setParameter('start_date', $startDate)
      ->setParameter('end_date', $endDate);

    return $this->findEntities($qb);
  }

  public function findAllUnbalancedTransactions($userId, $resultOffset = 0, $resultLimit = 50) {
    $qb = $this->db->getQueryBuilder();
    $qb->select('a.*')
      ->from('money_transactions', 'a')
      ->leftJoin('a', 'money_splits', 'b', 'b.transaction_id = a.id')
      ->where('a.user_id = :user_id')
      ->groupBy('a.id')
      ->having('SUM(b.value * b.convert_rate) <> 0')
      ->orderBy('a.date', 'DESC')
      ->addOrderBy('a.timestamp_added', 'DESC')
      ->addOrderBy('a.id', 'DESC')
      ->setFirstResult($resultOffset)
      ->setMaxResults($resultLimit)
      ->setParameter('user_id', $userId);

    return $this->findEntities($qb);
  }

}

?>
