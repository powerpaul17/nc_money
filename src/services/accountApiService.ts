import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';
import type { AxiosResponse } from 'axios';

import type {
  Account,
  ExtraData,
  MonthlyAccountStats
} from '../stores/accountStore';

let accountApiService: AccountApiService | null = null;

export const useAccountApiService = (): AccountApiService => {
  if (!accountApiService) accountApiService = new AccountApiService();
  return accountApiService;
};

class AccountApiService {
  private boundTransformApiResponseDataToAccount =
    this.transformApiResponseDataToAccount.bind(this);

  public async getAccount(accountId: number): Promise<Account> {
    const response = await axios.get<AccountApiResponseData>(
      generateUrl(`apps/money/accounts/${accountId}`)
    );
    return this.transformApiResponseDataToAccount(response.data);
  }

  public async getAccounts(): Promise<Array<Account>> {
    const response = await axios.get<Array<AccountApiResponseData>>(
      generateUrl('apps/money/accounts')
    );

    return response.data.map(this.boundTransformApiResponseDataToAccount);
  }

  public async addAccount(account: AccountCreationData): Promise<Account> {
    const response = await axios.post<
      AccountApiResponseData,
      AxiosResponse<AccountApiResponseData>,
      AccountApiSendData
    >(
      generateUrl('apps/money/accounts'),
      this.transformAccounToApiSendData(account)
    );

    return this.transformApiResponseDataToAccount(response.data);
  }

  public async deleteAccount(accountId: number): Promise<void> {
    await axios.delete(generateUrl(`apps/money/accounts/${accountId}`));
  }

  public async updateAccount(account: Account): Promise<Account> {
    const response = await axios.put<
      AccountApiResponseData,
      AxiosResponse<AccountApiResponseData>,
      AccountApiSendData
    >(
      generateUrl(`apps/money/accounts/${account.id}`),
      this.transformAccounToApiSendData(account)
    );

    return this.transformApiResponseDataToAccount(response.data);
  }

  private transformApiResponseDataToAccount(
    data: AccountApiResponseData
  ): Account {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      currency: data.currency,
      type: data.type,
      stats: data.stats,
      extraData: data.extraData
        ? (JSON.parse(data.extraData) as ExtraData)
        : {},
      bookId: data.bookId
    };
  }

  private transformAccounToApiSendData(
    data: Account | AccountCreationData
  ): AccountApiSendData {
    return {
      id: 'id' in data ? data.id : undefined,
      name: data.name,
      description: data.description,
      currency: data.currency,
      type: data.type,
      extraData: JSON.stringify(data.extraData),
      bookId: data.bookId
    };
  }
}

export type AccountCreationData = Omit<Account, 'id' | 'stats'>;

type AccountApiSendData = AccountApiCommonData & {
  id?: number;
};

type AccountApiResponseData = AccountApiCommonData & {
  id: number;
  stats: Record<string, Record<string, MonthlyAccountStats>>;
};

type AccountApiCommonData = {
  name: string;
  description: string;
  currency: string;
  type: number;
  extraData: string | null;
  bookId: number;
};
