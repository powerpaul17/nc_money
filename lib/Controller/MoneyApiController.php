<?php

namespace OCA\Money\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\ApiController;

use OCA\Money\Service\AccountService;
use OCA\Money\Service\CurrencyService;

class MoneyApiController extends ApiController {

  private $userId;

  private $accountService;
  private $currencyService;

  use Errors;

  public function __construct($appName, IRequest $request, AccountService $accountService, CurrencyService $currencyService, $userId) {
    parent::__construct($appName, $request);
    $this->accountService = $accountService;
    $this->currencyService = $currencyService;
    $this->userId = $userId;
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function getAccounts($userId) {
    return new DataResponse($this->accountService->findAll($userId));
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  */
  public function getCurrencies($userId) {
    return new DataResponse($this->currencyService->findAll($userId));
  }
}

?>
