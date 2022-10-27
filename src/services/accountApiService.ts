import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';

import { defineStore } from 'pinia';

import type { Account } from '../stores/accountStore';

export const useAccountApiService = defineStore('accountApiService', () => {

  async function getAccount(accountId: number): Promise<Account> {
    const response = await axios.get(
      generateUrl(`apps/money/accounts/${accountId}`)
    );
    return createAccountFromResponseData(response.data);
  }

  async function getAccounts(): Promise<Array<Account>> {
    const response = await axios.get<Array<AccountApiResponseData>>(
      generateUrl('apps/money/accounts')
    );

    return response.data.map(createAccountFromResponseData);
  }

  async function addAccount(account: AccountCreationData): Promise<Account> {
    const response = await axios.post(
      generateUrl('apps/money/accounts'),
      account
    );

    return createAccountFromResponseData(response.data);
  }

  async function deleteAccount(accountId: number): Promise<void> {
    await axios.delete(generateUrl(`apps/money/accounts/${accountId}`));
  }

  async function updateAccount(account: Account): Promise<void> {
    await axios.put(generateUrl(`apps/money/accounts/${account.id}`), account);
  }

  function createAccountFromResponseData(
    data: AccountApiResponseData
  ): Account {
    // TODO fix in API controller
    ensureNumbersInAccountStatsData(data.stats);

    return {
      id: Number(data.id), // TODO fix in API controller
      name: data.name,
      description: data.description,
      currency: data.currency,
      type: Number(data.type), // TODO fix in API controller
      balance: Number(data.balance), // fix TODO in API controller
      stats: data.stats
    };
  }

  function ensureNumbersInAccountStatsData(
    stats: AccountApiResponseData['stats']
  ): void {
    for (const [ year, months ] of Object.entries(stats)) {
      for (const [ month, value ] of Object.entries(months)) {
        stats[year][month] = Number(value);
      }
    }
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
  id: string;
  name: string;
  description: string;
  currency: string;
  type: string;
  balance: string;
  stats: Record<number, Record<number, number>>;
};
