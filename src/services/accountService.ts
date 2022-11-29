import { defineStore } from 'pinia';

import {
  useAccountApiService,
  type AccountCreationData
} from './accountApiService';
import { useAccountStore, type Account } from '../stores/accountStore';

export const useAccountService = defineStore('accountService', () => {

  const accountStore = useAccountStore();
  const accountApiService = useAccountApiService();

  async function fetchAccounts(): Promise<void> {
    const accounts = await accountApiService.getAccounts();
    for (const account of accounts) {
      accountStore.insertAccount(account);
    }
  }

  async function refreshAccount(accountId: number): Promise<void> {
    const account = await accountApiService.getAccount(accountId);
    accountStore.insertAccount(account);
  }

  async function addAccount(account: AccountCreationData): Promise<Account> {
    const newAccount = await accountApiService.addAccount(account);
    accountStore.insertAccount(newAccount);

    return newAccount;
  }

  async function updateAccount(account: Account): Promise<void> {
    await accountApiService.updateAccount(account);
  }

  async function deleteAccount(accountId: number): Promise<void> {
    await accountApiService.deleteAccount(accountId);
    accountStore.deleteAccount(accountId);
  }

  return {
    fetchAccounts,
    refreshAccount,

    addAccount,
    updateAccount,
    deleteAccount
  };

});
