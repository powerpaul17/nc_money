<?php

namespace OCA\Money\AppInfo;

use \OCP\AppFramework\App;

use \OCA\Money\Controller\PageController;
use \OCA\Money\Controller\SettingsController;
use \OCA\Money\Controller\MoneyApiController;

use \OCA\Money\Service\AccountService;
use \OCA\Money\Service\TranssactionService;
use \OCA\Money\Service\SplitService;

use \OCA\Money\Db\AccountMapper;
use \OCA\Money\Db\TransactionMapper;
use \OCA\Money\Db\SplitMapper;

use OCP\IUserSession;
use OCP\IConfig;

class Application extends App {

  public function __construct(array $urlParams=array()) {
    parent::__construct('money', $urlParams);

    $container = $this->getContainer();

    // Settings

    $container->registerService('Config', function($c) {
      return $c->query('ServerContainer')->getConfig();
    });

    // Controllers

    $container->registerService('PageController', function($c) {
      return new PageController(
        $c->query('AppName'),
        $c->query('Request')
      );
    });

    $container->registerService('SettingsController', function($c) {
      return new SettingsController(
        $c->query('AppName'),
        $c->query('Request'),
        $c->query('UserSession')
        // $c->getServer()->getConfig(),
      );
    });

    $container->registerService('MoneyApiController', function($c) {
      return new MoneyApiController(
        $c->query('AppName'),
        $c->query('Request'),
        $c->query('Db'),
        $c->query('AccountService'),
        $c->query('TransactionService'),
        $c->query('SplitService')
      );
    });

    // Services

    $container->registerService('AccountService', function($c) {
      return new AccountService(
        $c->query('AccountMapper')
      );
    });

    $container->registerService('TransactionService', function($c) {
      return new TransactionService(
        $c->query('TransactionMapper')
      );
    });

    $container->registerService('SplitService', function($c) {
      return new SplitService(
        $c->query('SplitMapper')
      );
    });

    // Mappers

    $container->registerService('AccountMapper', function($c) {
      return new AccountMapper(
        $c->query('ServerContainer')->getDb()
      );
    });

    $container->registerService('TransactionMapper', function($c) {
      return new TransactionMapper(
        $c->query('ServerContainer')->getDb()
      );
    });

    $container->registerService('SplitMapper', function($c) {
      return new SplitMapper(
        $c->query('ServerContainer')->getDb()
      );
    });

  }

}

?>
