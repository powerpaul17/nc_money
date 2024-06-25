<?php

namespace OCA\Money\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\Money\Db\Transaction;
use OCA\Money\Db\TransactionMapper;

use OCA\Money\AuditTrait;

class TransactionService {

  use AuditTrait;

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
    $transaction->setTimestampAdded(time());


    $insertedTransaction = $this->transactionMapper->insert($transaction);

    $this->emitCreateAuditEvent($userId, 'transaction', $insertedTransaction);

    return $insertedTransaction;
  }

  public function update($id, $description, $date, $userId) {
    try {
      $transaction = $this->transactionMapper->find($id, $userId);
      $originalTransaction = clone $transaction;

      $transaction->setDescription($description);
      $transaction->setDate($date);

      $updatedTransaction = $this->transactionMapper->update($transaction);

      $this->emitUpdateAuditEvents($userId, 'transaction', $updatedTransaction, $originalTransaction);

      return $updatedTransaction;
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

  public function findUnbalancedTransactions($userId, $resultOffset = 0, $resultLimit = 50) {
    return $this->transactionMapper->findAllUnbalancedTransactions($userId, $resultOffset, $resultLimit);
  }

}

?>
