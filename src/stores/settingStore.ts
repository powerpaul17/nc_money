import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';

export const useSettingStore = defineStore('settingStore', () => {

  const settings: Settings = {
    useInvertedAccounts: ref(true)
  };

  return settings;

});

export type Settings = {
  useInvertedAccounts: Ref<boolean>;
}
