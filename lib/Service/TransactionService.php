<?php

namespace OCA\Money\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\Money\Db\Transaction;
use OCA\Money\Db\TransactionMapper;
use OCA\Money\Db\Split;
use OCA\Money\Db\SplitMapper;

class TransactionService {

  private $transactionMapper;
  private $splitMapper;

  public function __construct(TransactionMapper $transactionMapper, SplitMapper $splitMapper) {
    $this->transactionMapper = $transactionMapper;
    $this->splitMapper = $splitMapper;
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

  public function findTransactionsBelongingToAccount($accountId, $userId) {
    try {
      return $this->transactionMapper->findAllTransactionsBelongingToAccount($userId, $accountId);
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

  public function create($description, $date, $userId) {
    $transaction = new Transaction();
    $transaction->setUserId($userId);
    $transaction->setDescription($description);
    $transaction->setDate($date);
    return $this->mapper->insert($account);
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
