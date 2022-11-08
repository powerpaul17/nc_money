import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';

export const useSettingStore = defineStore('settingStore', () => {

  const settings: Settings = {
    useInvertedAccounts: ref(true),
    numberFormat: {
      decimals: ref(2),
      decimalSeparator: ref('.'),
      groupBy: ref(3),
      groupSeparator: ref(' ')
    }
  };

  return settings;

});

export type Settings = {
  useInvertedAccounts: Ref<boolean>;
  numberFormat: NumberFormat;
}

export type NumberFormat = {
  decimals: Ref<number>;
  decimalSeparator: Ref<string>;
  groupBy: Ref<number>;
  groupSeparator: Ref<string>;
}
