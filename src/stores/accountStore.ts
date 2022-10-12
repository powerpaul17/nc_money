import { computed, reactive } from 'vue';

import { defineStore } from 'pinia';

export const useAccountStore = defineStore('accountStore', () => {
  const _accounts: Map<number, Account> = reactive(new Map());

  const assetsBalance = computed((): number => {
    return calculateBalance(_getByType(AccountType.ASSET));
  });

  const liabilitiesBalance = computed((): number => {
    return calculateBalance(_getByType(AccountType.LIABILITY));
  });

  const incomeBalance = computed((): number => {
    return calculateBalance(_getByType(AccountType.INCOME));
  });

  const expensesBalance = computed((): number => {
    return calculateBalance(_getByType(AccountType.EXPENSE));
  });

  const unbalancedValue = computed((): number => {
    return calculateBalance(accountArray.value);
  });

  const getById = computed(() => {
    return _getById;
  });

  function _getById(accountId: number) {
    return _accounts.get(accountId);
  }

  const getByType = computed(() => {
    return _getByType;
  });

  function _getByType(accountType: AccountType) {
    return accountArray.value.filter((a) => a.type === accountType);
  }

  const accountArray = computed(() => {
    return Array.from(_accounts.values());
  });

  function deleteAccount(accountId: number) {
    _accounts.delete(accountId);
  }

  function insertAccount(account: Account) {
    _accounts.set(account.id, account);
  }

  function addValue(accountId: number, value: number) {
    const account = _getById(accountId);
    if (!account) throw new Error('cannot add value to non-existing account');

    account.balance += value;
  }

  function calculateBalance(accounts: Array<Account>): number {
    return accounts.reduce<number>((balance, account) => {
      return (balance += account.balance);
    }, 0.0);
  }

  return {
    accountArray,

    assetsBalance,
    liabilitiesBalance,
    incomeBalance,
    expensesBalance,
    unbalancedValue,
    getById,
    getByType,

    insertAccount,
    deleteAccount,

    addValue
  };
});

export enum AccountType {
  ASSET = 0,
  LIABILITY = 1,
  INCOME = 2,
  EXPENSE = 3
}

export type Account = {
  id: number;
  name: string;
  type: AccountType;
  currency: string;
  description: string;
  balance: number;
  stats: Record<number, Record<number, number>>;
};
