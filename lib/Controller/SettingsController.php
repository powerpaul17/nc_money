<?php

namespace OCA\Money\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http;
use OCP\IConfig;
use OCP\IUserSession;
use OCP\IRequest;

class SettingsController extends Controller {

  private $config;
  private $userSession;
  private $userId;

  public function __construct($AppName, IRequest $request, IUserSession $userSession, IConfig $config) {
    parent::__construct($AppName, $request);
    $this->config = $config;
    $this->userSession = $userSession;
    $this->userId = $userSession->getUser()->getUID();
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  *
  * @param string $key
  */
  public function getConfig($key) {
    switch ($key) {
      case 'accountSummaryCurrency':
        return $this->getAccountSummaryCurrency();
      default:
        return new JSONResponse([], Http::STATUS_BAD_REQUEST);
    }
  }

  /**
  * @NoCSRFRequired
  * @NoAdminRequired
  *
  * @param string $key
  * @param mixed $value
  */
  public function setConfig($key, $value) {
    switch ($key) {
      case 'accountSummaryCurrency':
        return $this->setAccountSummaryCurrency($value);
      default:
        return new JSONResponse([], Http::STATUS_BAD_REQUEST);
    }
  }

  /**
  * @param string $currency
  */
  private function setAccountSummaryCurrency($currency) {
    try {
      $this->config->setUserValue($this->userId, $this->appName, 'accountSummaryCurrency', $currency);
    } catch (\Exception $e) {
      return new JSONResponse([], Http::STATUS_INTERNAL_SERVER_ERROR);
    }
    return new JSONResponse();
  }

  private function getAccountSummaryCurrency() {
    try {
      $accountSummaryCurrency = $this->config->getUserValue($this->userId, $this->appName, 'accountSummaryCurrency');
    } catch (\Exception $e) {
      return new JSONResponse([], Http::STATUS_INTERNAL_SERVER_ERROR);
    }
    return new JSONResponse([
      'value' => $accountSummaryCurrency
    ]);
  }

}

?>
