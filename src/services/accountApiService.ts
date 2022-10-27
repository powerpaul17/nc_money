import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';

import { defineStore } from 'pinia';

import type { Account } from '../stores/accountStore';

export const useAccountApiService = defineStore('accountApiService', () => {

  async function getAccount(accountId: number): Promise<Account> {
    const response = await axios.get(
      generateUrl(`apps/money/accounts/${accountId}`)
    );
    return response.data;
  }

  async function getAccounts(): Promise<Array<Account>> {
    const response = await axios.get<Array<AccountApiResponseData>>(
      generateUrl('apps/money/accounts')
    );

    return response.data;
  }

  async function addAccount(account: AccountCreationData): Promise<Account> {
    const response = await axios.post(
      generateUrl('apps/money/accounts'),
      account
    );

    return response.data;
  }

  async function deleteAccount(accountId: number): Promise<void> {
    await axios.delete(generateUrl(`apps/money/accounts/${accountId}`));
  }

  async function updateAccount(account: Account): Promise<void> {
    await axios.put(generateUrl(`apps/money/accounts/${account.id}`), account);
  }

  return {
    getAccount,
    getAccounts,
    addAccount,
    deleteAccount,
    updateAccount
  };

});

export type AccountCreationData = Omit<Account, 'id' | 'balance' | 'stats'>;

type AccountApiResponseData = {
  id: number;
  name: string;
  description: string;
  currency: string;
  type: number;
  balance: number;
  stats: Record<string, Record<string, number>>;
};
