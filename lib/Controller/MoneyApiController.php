<?php

namespace OCA\Money\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\ApiController;

use OCA\Money\Service\AccountService;
use OCA\Money\Service\CurrencyService;
use OCA\Money\Service\TransactionService;

class MoneyApiController extends ApiController {

  private $userId;

  private $accountService;
  private $currencyService;
  private $transactionService;

  use Errors;

  public function __construct($AppName, IRequest $request, AccountService $accountService, CurrencyService $currencyService, TransactionService $transactionService, $UserId) {
    parent::__construct($AppName, $request);
    $this->accountService = $accountService;
    $this->currencyService = $currencyService;
    $this->transactionService = $transactionService;
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
  public function updateAccount($accountId, $name, $type, $currencyId) {
    return $this->accountService->update($accountId, $name, $type, $currencyId, $this->userId);
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
    return new DataResponse($this->transactionService->findTransactionsBelongingToAccount($accountId, $this->userId));
  }

}

?>
