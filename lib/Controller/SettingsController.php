<?php

namespace OCA\Money\Controller;

use OCP\IConfig;
use OCP\IRequest;

use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

class SettingsController extends Controller {

  private $userId;
  private IConfig $settings;

  public function __construct(
    $UserId,
    $AppName,
    IConfig $settings,
    IRequest $request
    ) {
    parent::__construct($AppName, $request);

    $this->userId = $UserId;
    $this->settings = $settings;
  }

  /**
   * @NoCSRFRequired
   * @NoAdminRequired
   */
  public function getSettings() {
    $settings = [
      'useInvertedAccounts' => 'bool',
      'incomeExpenseAccountsValueFormat' => 'string',

      'numberFormat_decimals' => 'int',
      'numberFormat_decimalSeparator' => 'string',
      'numberFormat_groupBy' => 'int',
      'numberFormat_groupSeparator' => 'string'
    ];

    $data = [];

    foreach($settings as $setting => $type) {
      $value = $this->settings->getUserValue(
        $this->userId,
        $this->appName,
        $setting
      );

      if($value === '') continue;

      if($type === 'bool') {
        $value = $value === '1' ? true : false;
      } else if($type === 'int') {
        $value = (int) $value;
      }

      $data[$setting] = $value;
    }

    return $data;
  }

  /**
   * @NoCSRFRequired
   * @NoAdminRequired
   */
  public function updateSettings(
    $useInvertedAccounts,
    $incomeExpenseAccountsValueFormat,

    $numberFormat_decimals,
    $numberFormat_decimalSeparator,
    $numberFormat_groupBy,
    $numberFormat_groupSeparator
  ) {
    $settings = [
      'useInvertedAccounts' => $useInvertedAccounts,
      'incomeExpenseAccountsValueFormat' => $incomeExpenseAccountsValueFormat,

      'numberFormat_decimals' => $numberFormat_decimals,
      'numberFormat_decimalSeparator' => $numberFormat_decimalSeparator,
      'numberFormat_groupBy' => $numberFormat_groupBy,
      'numberFormat_groupSeparator' => $numberFormat_groupSeparator
    ];

    foreach($settings as $setting => $value) {
      if(is_bool($value)) {
        $value = $value ? '1' : '0';
      }

      $this->settings->setUserValue(
        $this->userId,
        $this->appName,
        $setting,
        $value
      );
    }

    return [ 'success' => true ];
  }

}
