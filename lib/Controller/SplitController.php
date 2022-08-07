<?php

namespace OCA\Money\Controller;

use OCP\IRequest;
use OCP\IDBConnection;

use OCA\Money\Controller\MoneyController;
use OCA\Money\Service\SplitService;

class SplitController extends MoneyController {

  private SplitService $splitService;

  public function __construct(string $AppName, IRequest $request, IDBConnection $db, $UserId, SplitService $splitService) {
    parent::__construct($AppName, $request, $db, $UserId);

    $this->splitService = $splitService;
  }

  /**
   * @NoAdminRequired
   *
   * @param int $transactionId
   */
  public function getSplitsForTransaction($transactionId) {
    return $this->splitService->findSplitsOfTransaction($transactionId, $this->userId);
  }

  /**
   * @NoAdminRequired
   *
   * @param int $id
   * @param int $transactionId
   * @param int $destAccountId
   * @param float $value
   * @param float $convertRate
   */
  public function updateSplit($id, $transactionId, $destAccountId, $value, $convertRate, $description) {
    return $this->splitService->update($id, $transactionId, $destAccountId, $value, $convertRate, $description, $this->userId);
  }

  /**
   * @NoAdminRequired
   *
   * @param int $transactionId
   * @param int $destAccountId
   * @param float $value
   * @param float $convertRate
   */
  public function addSplit($transactionId, $destAccountId, $value, $convertRate, $description) {
    return $this->splitService->create($transactionId, $destAccountId, $value, $convertRate, $description, $this->userId);
  }

  /**
   * @NoAdminRequired
   *
   * @param int $id
   */
  public function deleteSplit($id) {
    return $this->handleNotFound(function() use ($id) {
      return $this->splitService->delete($id, $this->userId);
    });
  }


}
