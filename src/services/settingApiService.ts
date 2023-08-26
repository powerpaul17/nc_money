import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';

let settingApiService: SettingApiService|null = null;

export const useSettingApiService = (): SettingApiService => {
  if (!settingApiService) settingApiService = new SettingApiService();
  return settingApiService;
};

class SettingApiService {

  public async loadSettings(): Promise<SettingsApiData> {
    const response = await axios.get<SettingsApiData>(generateUrl('apps/money/settings'));
    return response.data;
  }

  public async saveSettings(settings: SettingsApiData): Promise<void> {
    await axios.post(
      generateUrl('apps/money/settings'),
      settings
    );
  }

}

export type SettingsApiData = {
  useInvertedAccounts?: boolean;

  numberFormat_decimals?: number;
  numberFormat_decimalSeparator?: string;
  numberFormat_groupBy?: number;
  numberFormat_groupSeparator?: string;
};
