<?php

namespace OCA\Money\Controller;

use OCP\IRequest;
use OCP\Util;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\IConfig;

class PageController extends Controller {

  private IConfig $config;

  public function __construct(
    string $AppName,
    IRequest $request,
    IConfig $config
  ) {
    parent::__construct($AppName, $request);

    $this->config = $config;
  }

  /**
   * @NoAdminRequired
   * @NoCSRFRequired
   */
  public function index() {
    Util::addScript($this->appName, 'money-main.iife');
    Util::addStyle($this->appName, '../js/money-main');

    $response = new TemplateResponse($this->appName, 'main');

    if($this->config->getSystemValue('debug')) {
      $csp = new ContentSecurityPolicy();
      $csp->allowEvalScript(true);
      $response->setContentSecurityPolicy($csp);
    }

    return $response;
  }

}
