<?php

namespace OCA\Money\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\ApiController;

use OCA\Money\Service\AccountService;
use OCA\Money\Service\CurrencyService;
use OCA\Money\Service\TransactionService;
use OCA\Money\Service\SplitService;

class MoneyApiController extends ApiController {

  private $userId;

  private $accountService;
  private $currencyService;
  private $transactionService;
  private $splitService;

  use Errors;

  public function __construct($AppName, IRequest $request, AccountService $accountService, CurrencyService $currencyService, TransactionService $transactionService, SplitService $splitService, $UserId) {
    parent::__construct($AppName, $request);
    $this->accountService = $accountService;
    $this->currencyService = $currencyService;
    $this->transactionService = $transactionService;
    $this->splitService = $splitService;
    $this->userId = $UserId;
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function getAccounts() {
    return new DataResponse($this->accountService->findAll($this->userId));
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function getAccount($accountId) {
    return new DataResponse($this->accountService->find($accountId, $this->userId));
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function updateAccount($id, $name, $type, $currencyId, $description) {
    return $this->accountService->update($id, $name, $type, $currencyId, $description, $this->userId);
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function addAccount($name, $type, $currencyId, $description) {
    return $this->accountService->create($name, $type, $currencyId, $description, $this->userId);
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function getCurrencies() {
    return new DataResponse($this->currencyService->findAll($this->userId));
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function getTransactionsForAccount($accountId) {
    return new DataResponse($this->transactionService->findTransactionsOfAccount($accountId, $this->userId));
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function getTransaction($transactionId) {
    return new DataResponse($this->transactionService->find($transactionId, $this->userId));
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function updateTransaction($id, $description, $timestamp) {
    return $this->transactionService->update($id, $description, $timestamp, $this->userId);
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function addSimpleTransaction($srcAccountId, $destAccountId, $value, $convertRate, $timestamp, $description) {
    $newTransaction = $this->transactionService->create($description, $timestamp, $this->userId);

    $this->splitService->create($newTransaction->id, $destAccountId, $value/$convertRate, $convertRate, $timestamp, $description, $this->userId);
    $this->splitService->create($newTransaction->id, $srcAccountId, -$value, 1, $timestamp, $description, $this->userId);

    return $newTransaction;
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
    return new DataResponse($this->splitService->findSplitsOfTransaction($transactionId, $this->userId));
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function updateSplit($id, $transactionId, $destAccountId, $value, $convertRate, $timestamp, $description) {
    return $this->splitService->update($id, $transactionId, $destAccountId, $value, $convertRate, $timestamp, $description, $this->userId);
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function addSplit($transactionId, $destAccountId, $value, $convertRate, $timestamp, $description) {
    return $this->splitService->create($transactionId, $destAccountId, $value, $convertRate, $timestamp, $description, $this->userId);
  }

}

?>
