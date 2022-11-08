import { defineStore } from 'pinia';

export const useSettingApiService = defineStore('settingApiService', () => {

  async function loadSettings(): Promise<SettingsApiData> {
  }

  async function saveSettings(settings: SettingsApiData): Promise<void> {
  }

  return {
    loadSettings,
    saveSettings
  };

});

export type SettingsApiData = {
  useInvertedAccounts: boolean;
}
