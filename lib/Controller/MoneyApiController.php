<?php

namespace OCA\Money\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\ApiController;

use OCA\Money\Service\AccountService;
use OCA\Money\Service\TransactionService;
use OCA\Money\Service\SplitService;

class MoneyApiController extends ApiController {

  private $userId;

  private $accountService;
  private $transactionService;
  private $splitService;

  use Errors;

  public function __construct($AppName, IRequest $request, AccountService $accountService, TransactionService $transactionService, SplitService $splitService, $UserId) {
    parent::__construct($AppName, $request);
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
    $query = \OCP\DB::prepare('SELECT a.*, ROUND(SUM(b.value), 2) AS balance FROM *PREFIX*money_accounts a LEFT JOIN *PREFIX*money_splits b ON b.dest_account_id = a.id WHERE a.user_id = ? GROUP BY a.id;');
    return $query->execute([$this->userId])->fetchAll();
    //return new DataResponse($this->accountService->findAll($this->userId));
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function getAccount($accountId) {
    $query = \OCP\DB::prepare('SELECT a.*, ROUND(SUM(b.value), 2) AS balance FROM *PREFIX*money_accounts a LEFT JOIN *PREFIX*money_splits b ON b.dest_account_id = a.id WHERE a.id = ? AND a.user_id = ? GROUP BY a.id;');
    return $query->execute([$accountId, $this->userId])->fetch();
    //return new DataResponse($this->accountService->find($accountId, $this->userId));
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function updateAccount($id, $name, $type, $currency, $description) {
    return $this->accountService->update($id, $name, $type, $currency, $description, $this->userId);
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function addAccount($name, $type, $currency, $description) {
    return $this->accountService->create($name, $type, $currency, $description, $this->userId);
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function deleteAccount($id) {
    return $this->handleNotFound(function() use ($id) {
      return $this->accountService->delete($id, $this->userId);
    });
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function getTransactionsForAccount($accountId) {
    $query = \OCP\DB::prepare('SELECT a.*, ROUND(SUM(b.value), 2) AS value FROM *PREFIX*money_transactions a LEFT JOIN *PREFIX*money_splits b ON b.transaction_id = a.id WHERE b.dest_account_id = ? AND b.user_id = ? GROUP BY a.id;');
    //$query = \OCP\DB::prepare("SELECT a.*, GROUP_CONCAT(JSON_OBJECT('id', c.id, 'value', c.value)) AS splits FROM *PREFIX*money_transactions a LEFT JOIN *PREFIX*money_splits b ON b.transaction_id = a.id LEFT JOIN *PREFIX*money_splits c ON c.transaction_id = a.id WHERE b.dest_account_id = ? AND b.user_id = ? GROUP BY a.id;");
    $transactions = $query->execute([$accountId, $this->userId])->fetchAll();

    foreach($transactions as &$transaction) {
      $transaction['splits'] = $this->getSplitsForTransaction($transaction['id']);
    }
    unset($transaction);

    return $transactions;
    //return new DataResponse($this->transactionService->findTransactionsOfAccount($accountId, $this->userId));
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function getTransaction($transactionId) {
    $query = \OCP\DB::prepare('SELECT a.* FROM *PREFIX*money_transactions a WHERE a.id = ? AND a.user_id = ?;');
    $transaction = $query->execute([$transactionId, $this->userId])->fetch();
    //$transaction = $this->transactionService->find($transactionId, $this->userId);

    $transaction['splits'] = $this->getSplitsForTransaction($transactionId);

    return $transaction;
    //return new DataResponse($this->transactionService->find($transactionId, $this->userId));
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function updateTransaction($id, $description, $date) {
    return $this->transactionService->update($id, $description, $date, $this->userId);
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function addSimpleTransaction($srcAccountId, $destAccountId, $value, $convertRate, $date, $description) {
    $newTransaction = $this->transactionService->create($description, $date, $this->userId);

    $this->splitService->create($newTransaction->id, $destAccountId, $value/$convertRate, $convertRate, "", $this->userId);
    $this->splitService->create($newTransaction->id, $srcAccountId, -$value, 1, "", $this->userId);

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
  public function getSplitsForTransaction($transactionId) {
    return $this->splitService->findSplitsOfTransaction($transactionId, $this->userId);
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function updateSplit($id, $transactionId, $destAccountId, $value, $convertRate, $description) {
    return $this->splitService->update($id, $transactionId, $destAccountId, $value, $convertRate, $description, $this->userId);
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function addSplit($transactionId, $destAccountId, $value, $convertRate, $description) {
    return $this->splitService->create($transactionId, $destAccountId, $value, $convertRate, $description, $this->userId);
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function deleteSplit($splitId) {
    return $this->handleNotFound(function() use ($splitId) {
      return $this->splitService->delete($splitId, $this->userId);
    });
  }


  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function getAccountBalance($accountId) {
    $query = \OCP\DB::prepare('SELECT ROUND(SUM(value), 2) AS balance FROM *PREFIX*money_splits WHERE dest_account_id = ?;');
    $result = $query->execute([$accountId])->fetch();
    return $result;
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function getUnbalancedTransactions() {
    $query = \OCP\DB::prepare('SELECT a.* FROM *PREFIX*money_transactions a LEFT JOIN *PREFIX*money_splits b ON b.transaction_id = a.id WHERE a.user_id = ? GROUP BY a.id HAVING ROUND(SUM(b.value * b.convert_rate), 2) <> 0;');
    $transactions = $query->execute([$this->userId])->fetchAll();

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
