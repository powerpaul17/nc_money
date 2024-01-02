<?php

namespace OCA\Money\Settings;

use OCP\Util;

use OCP\Settings\ISettings;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\IConfig;

class PersonalSettings implements ISettings {

  /** @var string  */
  private $appName;

  private IConfig $config;

  public function __construct(string $AppName, IConfig $config) {
    $this->appName = $AppName;
    $this->config = $config;
  }

  public function getForm() {
    Util::addScript($this->appName, 'money-personal-settings.iife');
    Util::addStyle($this->appName, '../js/money-personal-settings');

    $response = new TemplateResponse($this->appName, 'personalSettings');

    if($this->config->getSystemValue('debug')) {
      $csp = new ContentSecurityPolicy();
      $csp->allowEvalScript(true);
      $response->setContentSecurityPolicy($csp);
    }

    return $response;
  }

  public function getSection() {
    return 'additional';
  }

  public function getPriority() {
    return 10;
  }

}
