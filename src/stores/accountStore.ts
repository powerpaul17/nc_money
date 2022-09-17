import { defineStore } from 'pinia';

import {
  useAccountApiService,
  type AccountCreationData
} from '../services/accountApiService';

export const useAccountStore = defineStore('account', {
  state: (): State => ({
    accounts: new Map()
  }),
  getters: {
    assetsBalance(): number {
      return calculateBalance(this.getByType(AccountType.ASSET));
    },
    liabilitiesBalance(): number {
      return calculateBalance(this.getByType(AccountType.LIABILITY));
    },
    incomeBalance(): number {
      return calculateBalance(this.getByType(AccountType.INCOME));
    },
    expensesBalance(): number {
      return calculateBalance(this.getByType(AccountType.EXPENSE));
    },
    unbalancedValue(): number {
      return calculateBalance(this.accountArray);
    },
    getById: (state) => {
      return (accountId: number) => state.accounts.get(accountId);
    },
    getByType() {
      return (accountType: AccountType) => {
        return this.accountArray.filter((a) => a.type === accountType);
      };
    },
    accountArray: (state) => {
      return Array.from(state.accounts.values());
    }
  },
  actions: {
    async fillCache() {
      const accountApiService = useAccountApiService();
      const accounts = await accountApiService.getAccounts();
      for (const account of accounts) {
        this.insertAccount(account);
      }
    },
    async updateAccount(account: Account) {
      const accountApiService = useAccountApiService();
      await accountApiService.updateAccount(account);
    },
    async addAccount(account: AccountCreationData) {
      const accountApiService = useAccountApiService();

      const newAccount = await accountApiService.addAccount(account);
      this.insertAccount(newAccount);

      return newAccount;
    },
    async deleteAccount(accountId: number) {
      const accountApiService = useAccountApiService();
      await accountApiService.deleteAccount(accountId);
      this.accounts.delete(accountId);
    },
    insertAccount(account: Account) {
      this.accounts.set(account.id, account);
    },
    addValue(accountId: number, value: number) {
      const account = this.getById(accountId);
      if (!account) throw new Error('cannot add value to non-existing account');

      account.balance += value;
    }
  }
});

function calculateBalance(accounts: Array<Account>): number {
  return accounts.reduce<number>((balance, account) => {
    return (balance += account.balance);
  }, 0.0);
}

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
