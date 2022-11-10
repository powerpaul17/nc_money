import type { WatchStopHandle } from 'vue';
import { defineStore } from 'pinia';

import { showSuccess } from '@nextcloud/dialogs';

import { useSettingStore } from '../stores/settingStore';
import { useSettingApiService } from './settingApiService';

export const useSettingService = defineStore('settingService', () => {

  const settingStore = useSettingStore();
  const settingApiService = useSettingApiService();

  let watcher: WatchStopHandle|null = null;

  function setupWatcher(): void {
    watcher = settingStore.$subscribe(async () => {
      await saveSettings();
      showSuccess(t('money', 'Settings saved'));
    });
  }

  function disposeWatcher(): void {
    watcher?.();
  }

  async function loadSettings(): Promise<void> {
    disposeWatcher();

    const newSettings = await settingApiService.loadSettings();

    settingStore.useInvertedAccounts = newSettings.useInvertedAccounts ?? true;

    settingStore.numberFormat_decimals = newSettings.numberFormat_decimals ?? 2;
    settingStore.numberFormat_decimalSeparator = newSettings.numberFormat_decimalSeparator ?? '.';
    settingStore.numberFormat_groupBy = newSettings.numberFormat_groupBy ?? 3;
    settingStore.numberFormat_groupSeparator = newSettings.numberFormat_groupSeparator ?? ' ';

    setupWatcher();
  }

  async function saveSettings(): Promise<void> {
    await settingApiService.saveSettings(settingStore.$state);
  }

  return {
    loadSettings,
    saveSettings
  };

});
