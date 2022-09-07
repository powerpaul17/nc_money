<?php

namespace OCA\Money\Controller;

use OCP\IRequest;
use OCP\Util;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;

class PageController extends Controller {

  public function __construct(string $AppName, IRequest $request) {
    parent::__construct($AppName, $request);
  }

  /**
   * @NoAdminRequired
   * @NoCSRFRequired
   */
  public function index() {
    Util::addScript($this->appName, 'money-main.iife');
    Util::addStyle($this->appName, '../js/style');

    return new TemplateResponse($this->appName, 'main');
  }

}
