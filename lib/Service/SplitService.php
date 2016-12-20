<?php

namespace OCA\Money\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

//use OCA\Money\Db\Transaction;
//use OCA\Money\Db\TransactionMapper;
use OCA\Money\Db\Split;
use OCA\Money\Db\SplitMapper;

class SplitService {

  //private $transactionMapper;
  private $splitMapper;

  //public function __construct(TransactionMapper $transactionMapper, SplitMapper $splitMapper) {
  public function __construct(SplitMapper $splitMapper) {
    //$this->transactionMapper = $transactionMapper;
    $this->splitMapper = $splitMapper;
  }

  public function findAll($userId) {
    return $this->splitMapper->findAll($userId);
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
      return $this->splitMapper->find($id, $userId);
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

  public function findSplitsOfTransaction($transactionId, $userId) {
    try {
      return $this->splitMapper->findAllSplitsOfTransaction($userId, $transactionId);
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

  public function create($description, $date, $transactionId, $destAccountId, $convertRate, $value, $userId) {
    $split = new Split();
    $split->setUserId($userId);

    $split->setDescription($description);
    $split->setDate($date);
    $split->setTransactionId($transactionId);
    $split->setDestAccountId($destAccountId);
    $split->convertRate($convertRate);
    $split->value($value);

    return $this->splitMapper->insert($split);
  }

  public function update($id, $description, $date, $transactionId, $destAccountId, $convertRate, $value, $userId) {
    try {
      $split = $this->splitMapper->find($id, $userId);

      $split->setDescription($description);
      $split->setDate($date);
      $split->setTransactionId($transactionId);
      $split->setDestAccountId($destAccountId);
      $split->convertRate($convertRate);
      $split->value($value);
      
      return $this->splitMapper->update($split);
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

}

?>
