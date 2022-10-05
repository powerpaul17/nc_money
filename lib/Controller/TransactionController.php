<?php

namespace OCA\Money\Controller;

use OCP\IRequest;
use OCP\IDBConnection;

use OCA\Money\Controller\MoneyController;
use OCA\Money\Service\TransactionService;
use OCA\Money\Service\SplitService;

class TransactionController extends MoneyController {

  private TransactionService $transactionService;
  private SplitService $splitService;

  public function __construct(string $AppName, IRequest $request, IDBConnection $db, $UserId, TransactionService $transactionService, SplitService $splitService) {
    parent::__construct($AppName, $request, $db, $UserId);

    $this->transactionService = $transactionService;
    $this->splitService = $splitService;
  }

  /**
  * @NoAdminRequired
  *
  * @param int $accountId
  * @param int $resultOffset
  * @param int $resultLimit
  */
  public function getTransactionsForAccount($accountId, $resultOffset = 0, $resultLimit = 50) {
    $transactions = $this->transactionService->findTransactionsOfAccount($accountId, $this->userId, $resultOffset, $resultLimit);

    $result = [];

    foreach($transactions as &$transaction) {
      $number = array_push($result, $transaction->jsonSerialize());
      $result[$number-1]['splits'] = $this->getSplitsForTransaction($transaction->id);
    }
    unset($transaction);

    return $result;
  }

  /**
  * @NoAdminRequired
  *
  * @param int $accountId
  * @param string $startDate
  * @param string $endDate
  */
  public function getTransactionsForAccountByDate($accountId, $startDate, $endDate) {
    $transactions = $this->transactionService->findTransactionsOfAccountByDate($accountId, $this->userId, $startDate, $endDate);

    $result = [];

    foreach($transactions as &$transaction) {
      $number = array_push($result, $transaction->jsonSerialize());
      $result[$number-1]['splits'] = $this->getSplitsForTransaction($transaction->id);
    }
    unset($transaction);

    return $result;
  }

  /**
  * @NoAdminRequired
  *
  * @param int $transactionId
  */
  public function getTransaction($transactionId) {
    $transaction = $this->transactionService->find($transactionId, $this->userId);

    $result = $transaction->jsonSerialize();
    $result['splits'] = $this->getSplitsForTransaction($transactionId);

    return $result;
  }

  /**
   * @NoAdminRequired
   *
   * @param int $id
   */
  public function updateTransaction($id, $description, $date) {
    $transaction = $this->transactionService->update($id, $description, $date, $this->userId);
    $transaction = $this->getTransaction($transaction->id);
    return $transaction;
  }

  /**
   * @NoAdminRequired
   *
   * @param $date
   * @param string $description
   */
  public function addTransaction($date, $description) {
    return $this->transactionService->create($description, $date, $this->userId);
  }

  /**
   * @NoAdminRequired
   *
   * @param int $resultOffset
   * @param int $resultLimit
   */
  public function getUnbalancedTransactions($resultOffset = 0, $resultLimit = 50) {
    $transactions = $this->transactionService->findUnbalancedTransactions($this->userId, $resultOffset, $resultLimit);

    $results = [];

    foreach($transactions as &$transaction) {
      $resultItem = $transaction->jsonSerialize();
      $resultItem['splits'] = $this->getSplitsForTransaction($resultItem['id']);

      array_push($results, $resultItem);
    }

    return $results;
  }

  private function getSplitsForTransaction($transactionId) {
    return $this->splitService->findSplitsOfTransaction($transactionId, $this->userId);
  }

}
