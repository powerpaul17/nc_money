import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';
import type { AxiosResponse } from 'axios';

import type { Account, ExtraData, MonthlyAccountStats } from '../stores/accountStore';

let accountApiService: AccountApiService|null = null;

export const useAccountApiService = (): AccountApiService => {
  if (!accountApiService) accountApiService = new AccountApiService();
  return accountApiService;
};

class AccountApiService {

  private boundTransformApiDataToAccount = this.transformApiDataToAccount.bind(this);

  public async getAccount(accountId: number): Promise<Account> {
    const response = await axios.get<AccountApiData>(
      generateUrl(`apps/money/accounts/${accountId}`)
    );
    return this.transformApiDataToAccount(response.data);
  }

  public async getAccounts(): Promise<Array<Account>> {
    const response = await axios.get<Array<AccountApiData>>(
      generateUrl('apps/money/accounts')
    );

    return response.data.map(this.boundTransformApiDataToAccount);
  }

  public async addAccount(account: AccountCreationData): Promise<Account> {
    const response = await axios.post<
    AccountApiData,
    AxiosResponse<AccountApiData>,
    AccountCreationData
    >(
      generateUrl('apps/money/accounts'),
      account
    );

    return this.transformApiDataToAccount(response.data);
  }

  public async deleteAccount(accountId: number): Promise<void> {
    await axios.delete(generateUrl(`apps/money/accounts/${accountId}`));
  }

  public async updateAccount(account: Account): Promise<Account> {
    const response = await axios.put<
    AccountApiData,
    AxiosResponse<AccountApiData>,
    AccountApiData
    >(
      generateUrl(`apps/money/accounts/${account.id}`),
      this.transformAccounToApiData(account)
    );

    return this.transformApiDataToAccount(response.data);
  }

  private transformApiDataToAccount(data: AccountApiData): Account {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      currency: data.currency,
      type: data.type,
      stats: data.stats,
      extraData: data.extraData ? JSON.parse(data.extraData) as ExtraData : {}
    };
  }

  private transformAccounToApiData(data: Account): AccountApiData {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      currency: data.currency,
      type: data.type,
      stats: data.stats,
      extraData: JSON.stringify(data.extraData)
    };
  }

}

export type AccountCreationData = Omit<Account, 'id' | 'stats'>;

type AccountApiData = {
  id: number;
  name: string;
  description: string;
  currency: string;
  type: number;
  stats: Record<string, Record<string, MonthlyAccountStats>>;
  extraData: string|null;
};
