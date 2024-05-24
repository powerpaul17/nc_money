import dayjs from 'dayjs';

import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';

import type { Transaction } from '../stores/transactionStore';
import { useSplitStore } from '../stores/splitStore';
import { useSplitApiService, type SplitApiData } from './splitApiService';
import type { AxiosResponse } from 'axios';

let transactionApiService: TransactionApiService | null = null;

export const useTransactionApiService = (): TransactionApiService => {
  if (!transactionApiService)
    transactionApiService = new TransactionApiService();
  return transactionApiService;
};

class TransactionApiService {
  private boundCreateTransactionFromResponseData =
    this.createTransactionFromResponseData.bind(this);

  public async getTransactionsOfAccount(
    accountId: number,
    offset = 0,
    limit = 100
  ): Promise<Array<Transaction>> {
    const response = await axios.get<Array<TransactionApiData>>(
      generateUrl('apps/money/transactions/for-account'),
      {
        params: {
          accountId: accountId,
          resultOffset: offset,
          resultLimit: limit
        }
      }
    );

    return await Promise.all(
      response.data.map(this.boundCreateTransactionFromResponseData)
    );
  }

  public async getTransactionsOfAccountByDate(
    accountId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Array<Transaction>> {
    const response = await axios.get<Array<TransactionApiData>>(
      generateUrl('apps/money/transactions/for-account-by-date'),
      {
        params: {
          accountId: accountId,
          startDate: dayjs(startDate).format('YYYY-MM-DD'),
          endDate: dayjs(endDate).format('YYYY-MM-DD')
        }
      }
    );

    return await Promise.all(
      response.data.map(this.boundCreateTransactionFromResponseData)
    );
  }

  public async getUnbalancedTransactions(
    offset = 0,
    limit = 100
  ): Promise<Array<Transaction>> {
    const response = await axios.get<Array<TransactionApiData>>(
      generateUrl('apps/money/transactions/unbalanced'),
      {
        params: {
          resultOffset: offset,
          resultLimit: limit
        }
      }
    );

    return await Promise.all(
      response.data.map(this.boundCreateTransactionFromResponseData)
    );
  }

  public async addTransaction(
    transaction: TransactionCreationData
  ): Promise<Transaction> {
    const data = {
      ...transaction,
      date: dayjs(transaction.date).format('YYYY-MM-DD')
    };

    const response = await axios.post<
      TransactionApiData,
      AxiosResponse<TransactionApiData>,
      TransactionApiCreationData
    >(generateUrl('apps/money/transactions'), data);

    return await this.createTransactionFromResponseData(response.data);
  }

  public async updateTransaction(
    transaction: Transaction
  ): Promise<Transaction> {
    const data = {
      ...transaction,
      date: dayjs(transaction.date).format('YYYY-MM-DD')
    };

    const response = await axios.put<
      TransactionApiData,
      AxiosResponse<TransactionApiData>,
      TransactionApiData
    >(generateUrl(`apps/money/transactions/${transaction.id}`), data);

    return await this.createTransactionFromResponseData(response.data);
  }

  private async createTransactionFromResponseData(
    data: TransactionApiData | TransactionApiDataWithSplits
  ): Promise<Transaction> {
    const splitApiService = useSplitApiService();
    const splitStore = useSplitStore();

    if ('splits' in data) {
      const splits = data.splits.map(
        splitApiService.createSplitFromResponseData.bind(this)
      );
      await splitStore.insertSplits(splits);
    }

    return {
      id: data.id,
      description: data.description,
      date: new Date(data.date),
      timestampAdded: new Date(data.timestampAdded).valueOf()
    };
  }
}

export type TransactionCreationData = Omit<
  Transaction,
  'id' | 'timestampAdded'
>;

export type TransactionWithSplitsCreationData = TransactionCreationData & {
  srcAccountId: number;
  destAccountId?: number | null;
  value: number;
  convertRate: number;
  srcSplitComment?: string;
  destSplitComment?: string;
};

type TransactionApiData = {
  id: number;
  description: string;

  /** YYYY-MM-DD  */
  date: string;

  timestampAdded: number;
};

type TransactionApiDataWithSplits = TransactionApiData & {
  splits: Array<SplitApiData>;
};

type TransactionApiCreationData = Omit<
  TransactionApiData,
  'id' | 'timestampAdded'
>;
