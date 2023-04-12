<?php

declare(strict_types=1);

namespace OCA\Money\AppInfo;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCA\Money\Dashboard\OverviewWidget;

class Application extends App implements IBootstrap {

    public const APP_ID = 'money';

    public function __construct(array $urlParams = []) {
        parent::__construct(self::APP_ID, $urlParams);
    }

    public function register(IRegistrationContext $context): void {
        $context->registerDashboardWidget(OverviewWidget::class);
    }

    public function boot(IBootContext $context): void {
    }
}
