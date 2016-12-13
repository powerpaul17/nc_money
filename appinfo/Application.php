<?php

namespace OCA\Money\AppInfo;

use \OCP\AppFramework\App;

use \OCA\Money\ApiController\MoneyApiController;

use \OCA\Money\Service\AccountService;
use \OCA\Money\Service\CurrencyService;

use \OCA\Money\Db\AccountMapper;
use \OCA\Money\Db\CurrencyMapper;

class Application extends App {

  public function __construct(array $urlParams=array()) {
    parent::__construct('money', $urlParams);

    $container = $this->getContainer();

    $container->registerService('MoneyApiController', function($c) {
      return new MoneyApiController(
        $c->query('AppName'),
        $c->query('Request'),
        $c->query('AccountService'),
        $c->query('CurrencyService')
      );
    });

    $container->registerService('AccountService', function($c) {
      return new AccountService(
        $c->query('AccountMapper')
      );
    });

    $container->registerService('CurrencyService', function($c) {
      return new CurrencyService(
        $c->query('CurrencyMapper')
      );
    });

    $container->registerService('AccountMapper', function($c) {
      return new AccountMapper(
        $c->query('ServerContainer')->getDb()
      );
    });

    $container->registerService('CurrencyMapper', function($c) {
      return new CurrencyMapper(
        $c->query('ServerContainer')->getDb()
      );
    });

  }

}

?>
