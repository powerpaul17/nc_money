<?php

namespace OCA\Money\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\Money\Db\Split;
use OCA\Money\Db\SplitMapper;

use OCA\Money\AuditTrait;

class SplitService {

  use AuditTrait;

  private $splitMapper;

  public function __construct(SplitMapper $splitMapper) {
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

  public function create($transactionId, $destAccountId, $value, $convertRate, $description, $userId) {
    $split = new Split();
    $split->setUserId($userId);

    $split->setDescription($description);
    $split->setTransactionId($transactionId);
    $split->setDestAccountId($destAccountId);
    $split->setConvertRate($convertRate);
    $split->setValue($value);

    $insertedSplit = $this->splitMapper->insert($split);

    $this->emitCreateAuditEvent($userId, 'split', $insertedSplit);

    return $insertedSplit;
  }

  public function update($id, $transactionId, $destAccountId, $value, $convertRate, $description, $userId) {
    try {
      $split = $this->splitMapper->find($id, $userId);
      $originalSplit = clone $split;

      $split->setDescription($description);
      $split->setTransactionId($transactionId);
      $split->setDestAccountId($destAccountId);
      $split->setConvertRate($convertRate);
      $split->setValue($value);

      $updatedSplit = $this->splitMapper->update($split);

      $this->emitUpdateAuditEvents($userId, 'split', $updatedSplit, $originalSplit);

      return $updatedSplit;
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

  public function delete($id, $userId) {
    try {
      $split = $this->splitMapper->find($id, $userId);
      $this->splitMapper->delete($split);

      $this->emitDeleteAuditEvent($userId, 'split', $split);

      return $split;
    } catch(Exception $e) {
      $this->handleException($e);
    }
  }

}

?>
