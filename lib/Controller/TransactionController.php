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
   * @param int $srcAccountId
   * @param int $destAccountId
   * @param float $value
   * @param float $convertRate
   */
  public function addSimpleTransaction($srcAccountId, $destAccountId, $value, $convertRate, $date, $description, $srcSplitComment = '', $destSplitComment = '') {
    $newTransaction = $this->transactionService->create($description, $date, $this->userId);

    if ($destAccountId > 0) {
      $this->splitService->create($newTransaction->id, $destAccountId, $value/$convertRate, $convertRate, $destSplitComment, $this->userId);
    }
    $this->splitService->create($newTransaction->id, $srcAccountId, -$value, 1, $srcSplitComment, $this->userId);

    return $this->getTransaction($newTransaction->getId());
  }

  /**
   * @NoAdminRequired
   */
  public function addSplitTransaction() {
    // TODO
  }

  /**
   * @NoAdminRequired
   */
  public function addTransactions($transactions) {
    $count = 0;
    $value = 0.0;
    foreach($transactions as $transaction) {
      $newTransaction = $this->addSimpleTransaction($transaction['srcAccountId'], $transaction['destAccountId'], $transaction['value'], $transaction['convertRate'], $transaction['date'], $transaction['description'], $transaction['srcSplitComment']);
      foreach($newTransaction['splits'] as $split) {
        if($split->getDestAccountId() == $transaction['srcAccountId']) {
          $value += $split->getValue();
        }
      }
      $count++;
    }
    return [
      'transactionsAdded' => $count,
      'totalValue' => $value
    ];
  }

  /**
   * @NoAdminRequired
   *
   * @param int $resultOffset
   * @param int $resultLimit
   */
  public function getUnbalancedTransactions($resultOffset = 0, $resultLimit = 50) {
    $sql = 'SELECT a.* FROM *PREFIX*money_transactions a ' .
           'LEFT JOIN *PREFIX*money_splits b ON b.transaction_id = a.id ' .
           'WHERE a.user_id = ? ' .
           'GROUP BY a.id ' .
           'HAVING ROUND(SUM(b.value * b.convert_rate), 2) <> 0 ' .
           'ORDER BY a.date DESC, a.timestamp_added DESC, a.id DESC ' .
           'LIMIT ?,?;';
    $query = $this->db->prepare($sql);

    $query->bindValue(1, $this->userId, \PDO::PARAM_STR);
    $query->bindValue(2, $resultOffset, \PDO::PARAM_INT);
    $query->bindValue(3, $resultLimit, \PDO::PARAM_INT);

    $query->execute();

    $transactions = $query->fetchAll();

    $query->closeCursor();

    // $transactions = $query->execute([$this->userId])->fetchAll();

    foreach($transactions as &$transaction) {
      $transaction['splits'] = $this->getSplitsForTransaction($transaction['id']);
    }
    unset($transaction);
    return $transactions;
  }

  private function getSplitsForTransaction($transactionId) {
    return $this->splitService->findSplitsOfTransaction($transactionId, $this->userId);
  }

}
