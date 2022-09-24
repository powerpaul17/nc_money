import { computed, reactive } from 'vue';

import { defineStore } from 'pinia';

import {
  useAccountApiService,
  type AccountCreationData
} from '../services/accountApiService';

export const useAccountStore = defineStore('account', () => {
  const state: State = reactive({
    accounts: new Map()
  });

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
    return state.accounts.get(accountId);
  }

  const getByType = computed(() => {
    return _getByType;
  });

  function _getByType(accountType: AccountType) {
    return accountArray.value.filter((a) => a.type === accountType);
  }

  const accountArray = computed(() => {
    return Array.from(state.accounts.values());
  });

  async function fillCache() {
    const accountApiService = useAccountApiService();
    const accounts = await accountApiService.getAccounts();
    for (const account of accounts) {
      insertAccount(account);
    }
  }

  async function updateAccount(account: Account) {
    const accountApiService = useAccountApiService();
    await accountApiService.updateAccount(account);
  }

  async function addAccount(account: AccountCreationData) {
    const accountApiService = useAccountApiService();

    const newAccount = await accountApiService.addAccount(account);
    insertAccount(newAccount);

    return newAccount;
  }

  async function deleteAccount(accountId: number) {
    const accountApiService = useAccountApiService();
    await accountApiService.deleteAccount(accountId);
    state.accounts.delete(accountId);
  }

  function insertAccount(account: Account) {
    state.accounts.set(account.id, account);
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

    fillCache,
    addAccount,
    updateAccount,
    deleteAccount,
    addValue
  };
});

type State = {
  accounts: Map<number, Account>;
};

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
};
