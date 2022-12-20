import dayjs from 'dayjs';

import { computed, ref, type Ref } from 'vue';

import { defineStore } from 'pinia';

import { AccountTypeType } from './accountTypeStore';

export const useAccountStore = defineStore('accountStore', () => {
  const accounts: Ref<Array<Account>> = ref([]);

  const assetsBalance = computed((): number => {
    return calculateBalance(_getByType(AccountTypeType.ASSET));
  });

  const liabilitiesBalance = computed((): number => {
    return calculateBalance(_getByType(AccountTypeType.LIABILITY));
  });

  const incomeBalance = computed((): number => {
    return calculateBalance(_getByType(AccountTypeType.INCOME));
  });

  const expensesBalance = computed((): number => {
    return calculateBalance(_getByType(AccountTypeType.EXPENSE));
  });

  const unbalancedValue = computed((): number => {
    return calculateBalance(accounts.value);
  });

  function getIndex(accountId: number): number {
    return accounts.value.findIndex(a => a.id === accountId);
  }

  const getById = computed(() => {
    return _getById;
  });

  function _getById(accountId: number): Account|undefined {
    return accounts.value.find(a => a.id === accountId);
  }

  const getByType = computed(() => {
    return _getByType;
  });

  function _getByType(accountType: AccountTypeType): Array<Account> {
    return accounts.value.filter((a) => a.type === accountType);
  }

  const getSummary = computed(() => {
    return (accountId: number, year?: number, month?: number): number => {
      const date = dayjs();
      const y = year ?? date.year();
      const m = month ?? date.month() + 1;
      return _getById(accountId)?.stats[y]?.[m] ?? 0;
    };
  });

  const getSummaryByType = computed(() => {
    return (accountType: AccountTypeType, year?: number, month?: number): number => {
      return calculateSummary(_getByType(accountType), year, month);
    };
  });

  function deleteAccount(accountId: number): void {
    const index = getIndex(accountId);
    if (index >= 0) {
      accounts.value.splice(index, 1);
    }
  }

  function insertAccount(account: Account): void {
    const index = getIndex(account.id);
    if (index >= 0) {
      accounts.value.splice(index, 1, account);
    } else {
      accounts.value.push(account);
    }
  }

  function addValue(accountId: number, value: number, date?: Date): void {
    const account = _getById(accountId);
    if (!account) throw new Error('cannot add value to non-existing account');

    account.balance += value;

    if (date) {
      addSummaryValue(accountId, value, date);
    }
  }

  function addSummaryValue(accountId: number, value: number, date: Date): void {
    const account = _getById(accountId);
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

  function calculateBalance(accounts: Array<Account>): number {
    return accounts.reduce<number>((balance, account) => {
      return (balance += account.balance);
    }, 0.0);
  }

  function calculateSummary(
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

  return {
    accounts,

    assetsBalance,
    liabilitiesBalance,
    incomeBalance,
    expensesBalance,
    unbalancedValue,
    getById,
    getByType,
    getSummary,
    getSummaryByType,

    insertAccount,
    deleteAccount,

    addValue,
    addSummaryValue
  };
});

export type Account = {
  id: number;
  name: string;
  type: AccountTypeType;
  currency: string;
  description: string;
  balance: number;
  stats: Record<number, Record<number, number>>;
};
