import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';

export const useSettingStore = defineStore<
  'settingStore',
  Settings
>(
  'settingStore',
  () => {

    const useInvertedAccounts = ref(true);
    const numberFormat_decimals = ref(2);
    const numberFormat_decimalSeparator = ref('.');
    const numberFormat_groupBy = ref(3);
    const numberFormat_groupSeparator = ref(' ');

    return {
      useInvertedAccounts,

      numberFormat_decimals,
      numberFormat_decimalSeparator,
      numberFormat_groupBy,
      numberFormat_groupSeparator
    };

  }
);

export type Settings = {
  useInvertedAccounts: Ref<boolean>;

  numberFormat_decimals: Ref<number>;
  numberFormat_decimalSeparator: Ref<string>;
  numberFormat_groupBy: Ref<number>;
  numberFormat_groupSeparator: Ref<string>;
}
