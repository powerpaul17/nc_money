import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';
import type { AxiosResponse } from 'axios';

import { defineStore } from 'pinia';

import type { Account } from '../stores/accountStore';

export const useAccountApiService = defineStore('accountApiService', () => {

  async function getAccount(accountId: number): Promise<Account> {
    const response = await axios.get<AccountApiData>(
      generateUrl(`apps/money/accounts/${accountId}`)
    );
    return transformApiDataToAccount(response.data);
  }

  async function getAccounts(): Promise<Array<Account>> {
    const response = await axios.get<Array<AccountApiData>>(
      generateUrl('apps/money/accounts')
    );

    return response.data.map(transformApiDataToAccount);
  }

  async function addAccount(account: AccountCreationData): Promise<Account> {
    const response = await axios.post<
      AccountApiData,
      AxiosResponse<AccountApiData>,
      AccountCreationData
    >(
      generateUrl('apps/money/accounts'),
      account
    );

    return transformApiDataToAccount(response.data);
  }

  async function deleteAccount(accountId: number): Promise<void> {
    await axios.delete(generateUrl(`apps/money/accounts/${accountId}`));
  }

  async function updateAccount(account: Account): Promise<Account> {
    const response = await axios.put<
      AccountApiData,
      AxiosResponse<AccountApiData>,
      AccountApiData
    >(
      generateUrl(`apps/money/accounts/${account.id}`),
      transformAccounToApiData(account)
    );

    return transformApiDataToAccount(response.data);
  }

  function transformApiDataToAccount(data: AccountApiData): Account {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      currency: data.currency,
      type: data.type,
      balance: data.balance,
      stats: data.stats
    };
  }

  function transformAccounToApiData(data: Account): AccountApiData {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      currency: data.currency,
      type: data.type,
      balance: data.balance,
      stats: data.stats
    };
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

type AccountApiData = {
  id: number;
  name: string;
  description: string;
  currency: string;
  type: number;
  balance: number;
  stats: Record<string, Record<string, number>>;
};
