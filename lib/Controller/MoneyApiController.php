<?php

namespace OCA\Money\Controller;

use OCP\IRequest;
use OCP\IDBConnection;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\ApiController;

use OCA\Money\Service\AccountService;
use OCA\Money\Service\TransactionService;
use OCA\Money\Service\SplitService;

class MoneyApiController extends ApiController {

  private $userId;

  private $db;

  private $accountService;
  private $transactionService;
  private $splitService;

  use Errors;

  public function __construct($AppName, IRequest $request, IDBConnection $db, AccountService $accountService, TransactionService $transactionService, SplitService $splitService, $UserId) {
    parent::__construct($AppName, $request);
    $this->db = $db;
    $this->accountService = $accountService;
    $this->transactionService = $transactionService;
    $this->splitService = $splitService;
    $this->userId = $UserId;
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function getAccounts() {
    $sql = 'SELECT a.*, ROUND(SUM(b.value), 2) AS balance ' .
           'FROM *PREFIX*money_accounts a ' .
           'LEFT JOIN *PREFIX*money_splits b ON b.dest_account_id = a.id ' .
           'LEFT JOIN *PREFIX*money_transactions c ON b.transaction_id = c.id ' .
           'WHERE a.user_id = ? ' .
           'GROUP BY a.id;';
    $query = $this->db->prepare($sql);
    $query->bindParam(1, $this->userId, \PDO::PARAM_INT);
    $query->execute();
    $rows = $query->fetchAll();
    $query->closeCursor();
    return $rows;
    //return new DataResponse($this->accountService->findAll($this->userId));
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  *
  * @param int $accountId
  */
  public function getAccount($accountId) {
    $sql = 'SELECT a.*, ROUND(SUM(b.value), 2) AS balance ' .
           'FROM *PREFIX*money_accounts a ' .
           'LEFT JOIN *PREFIX*money_splits b ON b.dest_account_id = a.id ' .
           'LEFT JOIN *PREFIX*money_transactions c ON b.transaction_id = c.id ' .
           'WHERE a.id = ? AND a.user_id = ? ' .
           'GROUP BY a.id;';
    $query = $this->db->prepare($sql);

    $query->bindParam(1, $accountId, \PDO::PARAM_INT);
    $query->bindParam(2, $this->userId, \PDO::PARAM_STR);

    $query->execute();

    $row = $query->fetch();

    $query->closeCursor();

    return $row;
    //return new DataResponse($this->accountService->find($accountId, $this->userId));
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  *
  * @param int $id
  * @param int $type
  */
  public function updateAccount($id, $name, $type, $currency, $description) {
    $this->accountService->update($id, $name, $type, $currency, $description, $this->userId);
    return $this->getAccount($id);
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  *
  * @param int $type
  */
  public function addAccount($name, $type, $currency, $description) {
    $response = $this->accountService->create($name, $type, $currency, $description, $this->userId);
    return $this->getAccount($response->id);
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  *
  * @param int $id
  */
  public function deleteAccount($id) {
    return $this->handleNotFound(function() use ($id) {
      return $this->accountService->delete($id, $this->userId);
    });
  }

  /**
  * @NoCSRFRequired
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
  * @NoCSRFRequired
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
  * @NoCSRFRequired
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
  * @NoCSRFRequired
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
  * @NoCSRFRequired
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
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function addSplitTransaction() {
    // TODO
  }

  /**
  * @NoCSRFRequired
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
  * @NoCSRFRequired
  * @NoAdminRequired
  *
  * @param int $transactionId
  */
  public function getSplitsForTransaction($transactionId) {
    return $this->splitService->findSplitsOfTransaction($transactionId, $this->userId);
  }

  /**
  * @NoCSRFRequired
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
  * @NoCSRFRequired
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
  * @NoCSRFRequired
  * @NoAdminRequired
  *
  * @param int $splitId
  */
  public function deleteSplit($splitId) {
    return $this->handleNotFound(function() use ($splitId) {
      return $this->splitService->delete($splitId, $this->userId);
    });
  }


  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  *
  * @param int $accountId
  */
  public function getAccountBalance($accountId) {
    $sql = 'SELECT ROUND(SUM(a.value), 2) AS balance ' .
           'FROM *PREFIX*money_splits a ' .
           'LEFT JOIN *PREFIX*money_transactions b ON a.transaction_id = b.id ' .
           'WHERE dest_account_id = ? AND user_id = ?;';
    $query = $this->db->prepare($sql);

    $query->bindValue(1, $accountId, \PDO::PARAM_INT);
    $query->bindValue(2, $this->userId, \PDO::PARAM_STR);

    $query->execute();

    $result = $query->fetch();

    $query->closeCursor();

    // $result = $query->execute([$accountId, $this->userId])->fetch();
    return $result;
  }

  /**
  * @NoCSRFRequired
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

// Sum over all accounts for each category
//$query = \OCP\DB::prepare('SELECT a.type, FORMAT(SUM(b.value),2) FROM *PREFIX*money_accounts a LEFT JOIN *PREFIX*money_splits b ON b.dest_account_id = a.id GROUP BY a.type');

}

?>
