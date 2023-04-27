import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';

import { defineStore } from 'pinia';

export const useSettingApiService = defineStore('settingApiService', () => {

  async function loadSettings(): Promise<SettingsApiData> {
    const response = await axios.get<SettingsApiData>(generateUrl('apps/money/settings'));
    return response.data;
  }

  async function saveSettings(settings: SettingsApiData): Promise<void> {
    await axios.post(
      generateUrl('apps/money/settings'),
      settings
    );
  }

  return {
    loadSettings,
    saveSettings
  };

});

export type SettingsApiData = {
  useInvertedAccounts?: boolean;

  numberFormat_decimals?: number;
  numberFormat_decimalSeparator?: string;
  numberFormat_groupBy?: number;
  numberFormat_groupSeparator?: string;
};
