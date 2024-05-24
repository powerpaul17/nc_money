import type { WatchStopHandle } from 'vue';

import { translate as t } from '@nextcloud/l10n';

import { showSuccess } from '@nextcloud/dialogs';

import { useSettingStore } from '../stores/settingStore';
import { useSettingApiService } from './settingApiService';

let settingService: SettingService | null = null;

export const useSettingService = (): SettingService => {
  if (!settingService) settingService = new SettingService();
  return settingService;
};

class SettingService {
  private settingStore = useSettingStore();
  private settingApiService = useSettingApiService();

  private watcher: WatchStopHandle | null = null;

  private setupWatcher(): void {
    this.watcher = this.settingStore.subscribe(() => {
      void this.saveSettings().then(() => {
        showSuccess(t('money', 'Settings saved'));
      });
    });
  }

  private disposeWatcher(): void {
    this.watcher?.();
  }

  public async loadSettings(): Promise<void> {
    this.disposeWatcher();

    const newSettings = await this.settingApiService.loadSettings();

    this.settingStore.useInvertedAccounts.value =
      newSettings.useInvertedAccounts ?? true;

    this.settingStore.numberFormat_decimals.value =
      newSettings.numberFormat_decimals ?? 2;
    this.settingStore.numberFormat_decimalSeparator.value =
      newSettings.numberFormat_decimalSeparator ?? '.';
    this.settingStore.numberFormat_groupBy.value =
      newSettings.numberFormat_groupBy ?? 3;
    this.settingStore.numberFormat_groupSeparator.value =
      newSettings.numberFormat_groupSeparator ?? ' ';

    this.setupWatcher();
  }

  public async saveSettings(): Promise<void> {
    await this.settingApiService.saveSettings(this.settingStore.state.value);
  }
}
