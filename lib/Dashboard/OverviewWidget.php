<?php

namespace OCA\Money\Dashboard;

use OCP\Dashboard\IWidget;
use OCP\Dashboard\IIconWidget;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCA\Money\AppInfo\Application;

class OverviewWidget implements IWidget, IIconWidget {
    private IL10N $l10n;
    private IURLGenerator $urlGenerator;

    public function __construct(
        IL10N $l10n,
        IURLGenerator $urlGenerator
    ) {
        $this->l10n = $l10n;
        $this->urlGenerator = $urlGenerator;
    }

    /**
     * @return string Unique id that identifies the widget, e.g. the app id
     */
    public function getId(): string {
        return 'money-overview-widget';
    }

    /**
     * @return string User facing title of the widget
     */
    public function getTitle(): string {
        return $this->l10n->t('Financial Overview');
    }

    /**
     * @return int Initial order for widget sorting
     *   in the range of 10-100, 0-9 are reserved for shipped apps
     */
    public function getOrder(): int {
        return 20;
    }

    /**
     * @return string css class that displays an icon next to the widget title
     */
    public function getIconClass(): string {
        return 'icon-money';
    }

    public function getIconUrl(): string {
      return $this->urlGenerator->getAbsoluteURL(
              $this->urlGenerator->imagePath(Application::APP_ID, 'money.svg')
      );
    }

    /**
     * @return string|null The absolute url to the apps own view
     */
    public function getUrl(): ?string {
        return $this->urlGenerator->linkToRouteAbsolute(Application::APP_ID . '.page.index');
    }

    /**
     * Execute widget bootstrap code like loading scripts and providing initial state
     */
    public function load(): void {
        \OCP\Util::addScript(Application::APP_ID, Application::APP_ID . '-dashboard.iife');
        \OCP\Util::addStyle(Application::APP_ID, '../js/money-dashboard');
    }
}
