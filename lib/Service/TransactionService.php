<?php

namespace OCA\Money\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\Money\Db\Transaction;
use OCA\Money\Db\TransactionMapper;

class TransactionService {

  private $transactionMapper;

  public function __construct(TransactionMapper $transactionMapper) {
    $this->transactionMapper = $transactionMapper;
  }

  public function findAll($userId) {
    return $this->transactionMapper->findAll($userId);
  }

  private function handleException($e) {
    if ($e instanceof DoesNotExistException ||
        $e instanceof MultipleObjectsReturnedException) {
          throw new NotFoundException($e->getMessage());
    } else {
      throw $e;
    }
  }

  public function find($id, $userId) {
    try {
      return $this->transactionMapper->find($id, $userId);
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

  public function findTransactionsOfAccount($accountId, $userId, $resultOffset = 0, $resultLimit = 50) {
    try {
      return $this->transactionMapper->findAllTransactionsOfAccount($userId, $accountId, $resultOffset, $resultLimit);
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

  public function findTransactionsOfAccountByDate($accountId, $userId, $startDate, $endDate) {
    try {
      return $this->transactionMapper->findAllTransactionsOfAccountByDate($userId, $accountId, $startDate, $endDate);
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

  public function create($description, $date, $userId) {
    $transaction = new Transaction();
    $transaction->setUserId($userId);

    $transaction->setDescription($description);
    $transaction->setDate($date);
    $transaction->setTimestampAdded(date('Y-m-d H:i:s'));

    return $this->transactionMapper->insert($transaction);
  }

  public function update($id, $description, $date, $userId) {
    try {
      $transaction = $this->transactionMapper->find($id, $userId);

      $transaction->setDescription($description);
      $transaction->setDate($date);

      return $this->transactionMapper->update($transaction);
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

}

?>
