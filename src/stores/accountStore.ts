import dayjs from 'dayjs';

import { computed, ref, type ComputedRef, type Ref } from 'vue';

import { AccountTypeType } from './accountTypeStore';

let accountStore: AccountStore | null = null;

export const useAccountStore = (): AccountStore => {
  if (!accountStore) accountStore = new AccountStore();
  return accountStore;
};

export function resetAccountStore(): void {
  accountStore = null;
}

class AccountStore {
  public readonly accounts: Ref<Array<Account>> = ref([]);

  public getAssetsBalanceForBookId(bookId: number): ComputedRef<number> {
    return computed(() => {
      return this.calculateBalance({
        accounts: this.getByType({ bookId, accountType: AccountTypeType.ASSET })
          .value
      });
    });
  }

  public getLiabilitiesBalanceForBookId(bookId: number): ComputedRef<number> {
    return computed(() => {
      return this.calculateBalance({
        accounts: this.getByType({
          bookId,
          accountType: AccountTypeType.LIABILITY
        }).value
      });
    });
  }

  public getIncomeBalanceForBookId(bookId: number): ComputedRef<number> {
    return computed(() => {
      return this.calculateBalance({
        accounts: this.getByType({
          bookId,
          accountType: AccountTypeType.INCOME
        }).value
      });
    });
  }

  public getExpensesBalanceForBookId(bookId: number): ComputedRef<number> {
    return computed(() => {
      return this.calculateBalance({
        accounts: this.getByType({
          bookId,
          accountType: AccountTypeType.EXPENSE
        }).value
      });
    });
  }

  public getEquityForBookId(bookId: number): ComputedRef<number> {
    return computed(() => {
      return (
        this.getAssetsBalanceForBookId(bookId).value +
        this.getLiabilitiesBalanceForBookId(bookId).value
      );
    });
  }

  public getUnbalancedValueForBookId(bookId: number): ComputedRef<number> {
    return computed(() => {
      return this.calculateBalance({ accounts: this.getByBookId(bookId) });
    });
  }

  public getById(accountId: number): Account | undefined {
    return this.accounts.value.find((a) => a.id === accountId);
  }

  public getByBookId(bookId: number): Array<Account> {
    return this.accounts.value.filter((a) => a.bookId === bookId);
  }

  public getByType({
    bookId,
    accountType
  }: {
    bookId: number;
    accountType: AccountTypeType;
  }): Ref<Array<Account>> {
    return computed(() =>
      this.accounts.value.filter(
        (a) => a.bookId === bookId && a.type === accountType
      )
    );
  }

  public getValue({
    accountId,
    year,
    month
  }: {
    accountId: number;
    year?: number;
    month?: number;
  }): number {
    const date = dayjs();

    const y = year ?? date.year();
    const m = year && !month ? undefined : month ?? date.month() + 1;

    return this.getStatsOfAccount({ accountId, year: y, month: m }).value;
  }

  public getBalance({
    accountId,
    year,
    month
  }: {
    accountId: number;
    year?: number;
    month?: number;
  }): number {
    const date = dayjs();

    const y = year ?? date.year();
    const m = year && !month ? 12 : month ?? date.month() + 1;

    return this.getStatsOfAccount({ accountId, year: y, month: m }).balance;
  }

  public getBalanceByType({
    bookId,
    accountType,
    year,
    month
  }: {
    bookId: number;
    accountType: AccountTypeType;
    year?: number;
    month?: number;
  }): Ref<number> {
    return computed(() => {
      return this.calculateBalance({
        accounts: this.getByType({ bookId, accountType }).value,
        year,
        month
      });
    });
  }

  public getSummary({
    accountId,
    year,
    month
  }: {
    accountId: number;
    year?: number;
    month?: number;
  }): number {
    const date = dayjs();

    const y = year ?? date.year();

    return this.getStatsOfAccount({ accountId, year: y, month }).value;
  }

  public getSummaryByType({
    bookId,
    accountType,
    year,
    month
  }: {
    bookId: number;
    accountType: AccountTypeType;
    year?: number;
    month?: number;
  }): Ref<number> {
    return computed(() => {
      return this.calculateSummary(
        this.getByType({ bookId, accountType }).value,
        year,
        month
      );
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

  public addValue({
    accountId,
    value,
    date
  }: {
    accountId: number;
    value: number;
    date?: Date;
  }): void {
    const year = date?.getFullYear() ?? dayjs().year();
    const month = (date?.getMonth() ?? dayjs().month()) + 1;

    const account = this.getById(accountId);
    if (!account) throw new Error('account not available');

    const stats = this.getStatsOfAccount({ accountId, year, month });
    this.setStatsOfAccount({
      accountId,
      year,
      month,
      stats: {
        value: stats.value + value,
        balance: stats.balance + value
      }
    });

    this.updateStats({
      account,
      year,
      month,
      value
    });
  }

  private updateStats({
    account,
    year,
    month,
    value
  }: {
    account: Account;
    year: number;
    month: number;
    value: number;
  }): void {
    const latestYear = Math.max(...Object.keys(account.stats).map(Number));

    let y = year;
    let m = month + 1;

    if (m > 12) {
      y++;
      m = 1;
    }

    while (y <= latestYear) {
      while (m <= 12) {
        const stats = account.stats[y]?.[m];
        if (stats) {
          this.setStatsOfAccount({
            accountId: account.id,
            year: y,
            month: m,
            stats: {
              value: stats.value,
              balance: stats.balance + value
            }
          });
        }

        m++;
      }

      y++;
      m = 1;
    }
  }

  private calculateBalance({
    accounts,
    year,
    month
  }: {
    accounts: Array<Account>;
    year?: number;
    month?: number;
  }): number {
    const date = dayjs();

    const y = year ?? date.year();
    const m = year && !month ? 12 : month ?? date.month() + 1;

    return accounts.reduce<number>((balance, account) => {
      return (balance += this.getStatsOfAccount({
        accountId: account.id,
        year: y,
        month: m
      }).balance);
    }, 0.0);
  }

  private calculateSummary(
    accounts: Array<Account>,
    year?: number,
    month?: number
  ): number {
    const date = dayjs();

    const y = year ?? date.year();
    const m = year && !month ? undefined : month ?? date.month() + 1;

    return accounts.reduce<number>((summary, account) => {
      return (summary += this.getStatsOfAccount({
        accountId: account.id,
        year: y,
        month: m
      }).value);
    }, 0.0);
  }

  private getStatsOfAccount({
    accountId,
    year,
    month
  }: {
    accountId: number;
    year: number;
    month?: number;
  }): MonthlyAccountStats {
    const account = this.getById(accountId);

    if (!account) throw new Error('cannot get stats of non-existing account');

    const yearStats = account.stats[year] ?? {};

    const value =
      month != null
        ? yearStats[month]?.value ?? 0.0
        : Object.values(yearStats).reduce((v, monthValue) => {
            v += monthValue.value;
            return v;
          }, 0.0);

    const balance = this.getBalanceOfAccount({ account, year, month });

    return {
      value,
      balance
    };
  }

  private getBalanceOfAccount({
    account,
    year,
    month = 1
  }: {
    account: Account;
    year: number;
    month?: number;
  }): number {
    const years = Object.keys(account.stats).map(Number);
    if (!years.length) {
      return 0.0;
    }

    const earliestYear = Math.min(...years);
    const earliestMonth = Math.min(
      ...Object.keys(account.stats[earliestYear] ?? {}).map(Number)
    );
    const earliestDate = dayjs()
      .set('year', earliestYear)
      .set('month', earliestMonth);

    const latestYear = Math.max(...years);
    const latestMonth = Math.max(
      ...Object.keys(account.stats[latestYear] ?? {}).map(Number)
    );
    const latestDate = dayjs()
      .set('year', latestYear)
      .set('month', latestMonth);

    const date = dayjs().set('year', year).set('month', month);

    if (date.isAfter(latestDate)) {
      const yearStats = account.stats[latestYear];
      if (!yearStats) throw new Error('stats for year not found');

      const months = Object.keys(yearStats).map(Number);
      const latestMonth = Math.max(...months);

      const monthStats = yearStats[latestMonth];
      if (!monthStats) throw new Error('stats for month not found');

      return monthStats.balance;
    } else if (date.isBefore(earliestDate)) {
      return 0.0;
    }

    let y = year;
    let m = month;

    do {
      for (; m >= 1; m--) {
        const monthStats = account.stats[y]?.[m];
        if (monthStats) {
          return monthStats.balance;
        }
      }

      y--;
      m = 12;
    } while (y >= earliestYear);

    throw new Error('monthly stats not found');
  }

  private setStatsOfAccount({
    accountId,
    year,
    month,
    stats
  }: {
    accountId: number;
    year: number;
    month: number;
    stats: MonthlyAccountStats;
  }): void {
    const account = this.getById(accountId);

    if (!account) throw new Error('cannot set stats of non-existing account');

    const yearStats = account.stats[year];
    if (!yearStats) {
      account.stats[year] = {
        [month]: stats
      };
    } else {
      yearStats[month] = stats;
    }
  }

  private getIndex(accountId: number): number {
    return this.accounts.value.findIndex((a) => a.id === accountId);
  }
}

export type Account = {
  id: number;
  name: string;
  type: AccountTypeType;
  currency: string;
  description: string;
  stats: Record<number, Record<number, MonthlyAccountStats>>;
  extraData: Partial<ExtraData>;
  bookId: number;
};

export type MonthlyAccountStats = {
  balance: number;
  value: number;
};

export type ExtraData = {
  csvImport?: {
    columnSeparator?: string | null;
    decimalSeparator?: string | null;
    dateFormat?: string | null;
    columnMapping?: Record<string, string>;
  };
};

export type { AccountStore };
