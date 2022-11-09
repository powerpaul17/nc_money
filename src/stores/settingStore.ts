import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';

export const useSettingStore = defineStore('settingStore', () => {

  const settings: Settings = {
    useInvertedAccounts: ref(true),
    numberFormat_decimals: ref(2),
    numberFormat_decimalSeparator: ref('.'),
    numberFormat_groupBy: ref(3),
    numberFormat_groupSeparator: ref(' ')
  };

  return settings;

});

export type Settings = {
  useInvertedAccounts: Ref<boolean>;

  numberFormat_decimals: Ref<number>;
  numberFormat_decimalSeparator: Ref<string>;
  numberFormat_groupBy: Ref<number>;
  numberFormat_groupSeparator: Ref<string>;
}
