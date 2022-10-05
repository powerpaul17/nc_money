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
    const response = await axios.get(generateUrl('apps/money/accounts'));
    return response.data.map(createAccountFromResponseData);
  }

  async function addAccount(account: AccountCreationData): Promise<Account> {
    const response = await axios.post(
      generateUrl('apps/money/accounts'),
      account
    );

    return createAccountFromResponseData(response.data);
  }

  async function deleteAccount(accountId: number) {
    await axios.delete(generateUrl(`apps/money/accounts/${accountId}`));
  }

  async function updateAccount(account: Account) {
    await axios.put(generateUrl(`apps/money/accounts/${account.id}`), account);
  }

  function createAccountFromResponseData(
    data: AccountApiResponseData
  ): Account {
    return {
      id: Number(data.id), // TODO in API controller
      name: data.name,
      description: data.description,
      currency: data.currency,
      type: Number(data.type), // TODO in API controller
      balance: Number(data.balance) // TODO in API controller
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

export type AccountCreationData = Omit<Account, 'id' | 'balance'>;

type AccountApiResponseData = {
  id: string;
  name: string;
  description: string;
  currency: string;
  type: string;
  balance: string;
};
