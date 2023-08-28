import dayjs from 'dayjs';

import { computed, ref, type Ref } from 'vue';

import { AccountTypeType } from './accountTypeStore';

let accountStore: AccountStore|null = null;

export const useAccountStore = (): AccountStore => {
  if (!accountStore) accountStore = new AccountStore();
  return accountStore;
};

class AccountStore {

  public readonly accounts: Ref<Array<Account>> = ref([]);

  public readonly assetsBalance = computed((): number => {
    return this.calculateBalance(
      this.getByType(AccountTypeType.ASSET).value
    );
  });

  public readonly liabilitiesBalance = computed((): number => {
    return this.calculateBalance(
      this.getByType(AccountTypeType.LIABILITY).value
    );
  });

  public readonly incomeBalance = computed((): number => {
    return this.calculateBalance(
      this.getByType(AccountTypeType.INCOME).value
    );
  });

  public readonly expensesBalance = computed((): number => {
    return this.calculateBalance(
      this.getByType(AccountTypeType.EXPENSE).value
    );
  });

  public readonly unbalancedValue = computed((): number => {
    return this.calculateBalance(this.accounts.value);
  });

  private getIndex(accountId: number): number {
    return this.accounts.value.findIndex(a => a.id === accountId);
  }

  public getById(accountId: number): Account|undefined {
    return this.accounts.value.find(a => a.id === accountId);
  }

  public getByType(accountType: AccountTypeType): Ref<Array<Account>> {
    return computed(() => this.accounts.value.filter((a) => a.type === accountType));
  }

  public getSummary(accountId: number, year?: number, month?: number): Ref<number> {
    return computed(() => {
      const date = dayjs();
      const y = year ?? date.year();
      const m = month ?? date.month() + 1;
      return this.getById(accountId)?.stats[y]?.[m] ?? 0;
    });
  }

  public getSummaryByType(accountType: AccountTypeType, year?: number, month?: number): Ref<number> {
    return computed(() => {
      return this.calculateSummary(this.getByType(accountType).value, year, month);
    });
  }

  public deleteAccount(accountId: number): void {
    const index = this.getIndex(accountId);
    if (index >= 0) {
      this.accounts.value.splice(index, 1);
    }
  }

  public insertAccount(account: Account): void {
    const index = this.getIndex(account.id);
    if (index >= 0) {
      this.accounts.value.splice(index, 1, account);
    } else {
      this.accounts.value.push(account);
    }
  }

  public addValue(accountId: number, value: number, date?: Date): void {
    const account = this.getById(accountId);
    if (!account) throw new Error('cannot add value to non-existing account');

    account.balance += value;

    if (date) {
      this.addSummaryValue(accountId, value, date);
    }
  }

  public addSummaryValue(accountId: number, value: number, date: Date): void {
    const account = this.getById(accountId);
    if (!account)
      throw new Error('cannot add summary value to non-existing account');

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    let yearMap = account.stats[year];
    if (!yearMap) {
      yearMap = {};
      account.stats[year] = yearMap;
    }

    yearMap[month] = (yearMap[month] ?? 0) + value;
  }

  private calculateBalance(accounts: Array<Account>): number {
    return accounts.reduce<number>((balance, account) => {
      return (balance += account.balance);
    }, 0.0);
  }

  private calculateSummary(
    accounts: Array<Account>,
    year?: number,
    month?: number
  ): number {
    const date = dayjs();
    const y = year ?? date.year();
    const m = month ?? date.month() + 1;

    return accounts.reduce<number>((summary, account) => {
      return (summary += account.stats[y]?.[m] ?? 0);
    }, 0.0);
  }

}

export type Account = {
  id: number;
  name: string;
  type: AccountTypeType;
  currency: string;
  description: string;
  balance: number;
  stats: Record<number, Record<number, number>>;
};
