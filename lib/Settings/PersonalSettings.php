<?php

namespace OCA\Money\Settings;

use OCP\Util;

use OCP\Settings\ISettings;
use OCP\AppFramework\Http\TemplateResponse;

class PersonalSettings implements ISettings {

  /** @var string  */
  private $appName;

  public function __construct(string $AppName) {
    $this->appName = $AppName;
  }

  public function getForm() {
    Util::addScript($this->appName, 'money-personal-settings.iife');
    Util::addStyle($this->appName, '../js/money-personal-settings');

    return new TemplateResponse($this->appName, 'personalSettings');
  }

  public function getSection() {
    return 'additional';
  }

  public function getPriority() {
    return 10;
  }

}
