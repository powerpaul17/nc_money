import type { WatchStopHandle } from 'vue';
import { defineStore } from 'pinia';

import { useSettingStore } from '../stores/settingStore';
import { useSettingApiService } from './settingApiService';

export const useSettingService = defineStore('settingService', () => {

  const settingStore = useSettingStore();
  const settingApiService = useSettingApiService();

  let watcher: WatchStopHandle|null = null;

  function setupWatcher(): void {
    watcher = settingStore.$subscribe(async () => {
      await saveSettings();
    });
  }

  function disposeWatcher(): void {
    watcher?.();
  }

  async function loadSettings(): Promise<void> {
    disposeWatcher();

    const newSettings = await settingApiService.loadSettings();

    settingStore.useInvertedAccounts = newSettings.useInvertedAccounts;

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
