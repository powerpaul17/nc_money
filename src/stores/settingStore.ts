import { computed, ref, watch, type WatchStopHandle } from 'vue';

let settingStore: SettingStore|null = null;

export const useSettingStore = (): SettingStore => {
  if (!settingStore) settingStore = new SettingStore();
  return settingStore;
};

class SettingStore {

  public readonly useInvertedAccounts = ref(true);
  public readonly numberFormat_decimals = ref(2);
  public readonly numberFormat_decimalSeparator = ref('.');
  public readonly numberFormat_groupBy = ref(3);
  public readonly numberFormat_groupSeparator = ref(' ');

  private subscribers: Array<() => void> = [];

  constructor() {
    watch([
      this.useInvertedAccounts,
      this.numberFormat_decimals,
      this.numberFormat_decimalSeparator,
      this.numberFormat_groupBy,
      this.numberFormat_groupSeparator
    ], () => {
      this.notifySubscribers();
    });
  }

  public subscribe(callback: () => void): WatchStopHandle {
    this.subscribers.push(callback);

    return () => {
      const index = this.subscribers.findIndex(cb => callback === cb);
      this.subscribers.splice(index, 1);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(cb => cb());
  }

  public readonly state = computed((): Settings => {
    return {
      useInvertedAccounts: this.useInvertedAccounts.value,
      numberFormat_decimals: this.numberFormat_decimals.value,
      numberFormat_decimalSeparator: this.numberFormat_decimalSeparator.value,
      numberFormat_groupBy: this.numberFormat_groupBy.value,
      numberFormat_groupSeparator: this.numberFormat_groupSeparator.value
    };
  });

}

export type Settings = {
  useInvertedAccounts: boolean;

  numberFormat_decimals: number;
  numberFormat_decimalSeparator: string;
  numberFormat_groupBy: number;
  numberFormat_groupSeparator: string;
}
