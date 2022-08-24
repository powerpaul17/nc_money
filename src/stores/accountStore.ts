import { defineStore } from 'pinia';
import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';

export const useAccountStore = defineStore('account', {
  state: (): State => ({
    accounts: []
  }),
  getters: {
    assetsBalance: (state) => {
      return calculateBalance(
        state.accounts.filter((account) => account.type === AccountType.ASSET)
      );
    },
    liabilitiesBalance: (state) => {
      return calculateBalance(
        state.accounts.filter(
          (account) => account.type === AccountType.LIABILITY
        )
      );
    },
    incomeBalance: (state) => {
      return calculateBalance(
        state.accounts.filter((account) => account.type === AccountType.INCOME)
      );
    },
    expensesBalance: (state) => {
      return calculateBalance(
        state.accounts.filter((account) => account.type === AccountType.EXPENSE)
      );
    },
    unbalancedValue: (state) => {
      return calculateBalance(state.accounts);
    },
    getById: (state) => {
      return (accountId: number) =>
        state.accounts.find((a) => a.id === accountId);
    },
    getIndexOfAccountId: (state) => {
      return (accountId: number) => {
        return state.accounts.findIndex((a) => a.id === accountId);
      };
    },
    getByType: (state) => {
      return (accountType: AccountType) => {
        return state.accounts.filter((a) => a.type === accountType);
      };
    }
  },
  actions: {
    async fillCache() {
      const response = await axios.get(generateUrl('apps/money/accounts'));
      this.accounts = response.data.map(createAccountFromResponseData);
    },
    async updateAccount(account: Account) {
      await axios.put(
        generateUrl(`apps/money/accounts/${account.id}`),
        account
      );
    },
    async addAccount(account: AccountCreationData) {
      const response = await axios.post(
        generateUrl('apps/money/accounts'),
        account
      );

      const newAccount = createAccountFromResponseData(response.data);
      this.accounts.push(newAccount);

      return newAccount;
    },
    async deleteAccount(accountId: number) {
      await axios.delete(generateUrl(`apps/money/accounts/${accountId}`));

      const index = this.getIndexOfAccountId(accountId);
      this.accounts.splice(index, 1);
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

function createAccountFromResponseData(data): Account {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    currency: data.currency,
    type: data.type,
    balance: data.balance
  };
}

type State = {
  accounts: Array<Account>;
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

type AccountCreationData = Omit<Account, 'id' | 'balance'>;
