import { defineStore } from 'pinia';
import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';

export const useAccountStore = defineStore('account', {
  state: (): State => ({
    accounts: new Map()
  }),
  getters: {
    assetsBalance(): number {
      return calculateBalance(
        this.accountArray.filter(
          (account) => account.type === AccountType.ASSET
        )
      );
    },
    liabilitiesBalance(): number {
      return calculateBalance(
        this.accountArray.filter(
          (account) => account.type === AccountType.LIABILITY
        )
      );
    },
    incomeBalance(): number {
      return calculateBalance(
        this.accountArray.filter(
          (account) => account.type === AccountType.INCOME
        )
      );
    },
    expensesBalance(): number {
      return calculateBalance(
        this.accountArray.filter(
          (account) => account.type === AccountType.EXPENSE
        )
      );
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
      const response = await axios.get(generateUrl('apps/money/accounts'));
      for (const account of response.data.map(createAccountFromResponseData)) {
        this.accounts.set(account.id, account);
      }
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
      this.accounts.set(newAccount.id, newAccount);

      return newAccount;
    },
    async deleteAccount(accountId: number) {
      await axios.delete(generateUrl(`apps/money/accounts/${accountId}`));
      this.accounts.delete(accountId);
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
    id: Number(data.id), // TODO in API controller
    name: data.name,
    description: data.description,
    currency: data.currency,
    type: Number(data.type), // TODO in API controller
    balance: Number(data.balance) // TODO in API controller
  };
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

type AccountCreationData = Omit<Account, 'id' | 'balance'>;
