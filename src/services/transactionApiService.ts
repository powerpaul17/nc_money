import dayjs from 'dayjs';

import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';

import { defineStore } from 'pinia';

import type { Transaction } from '../stores/transactionStore';
import { useSplitStore } from '../stores/splitStore';
import { useSplitApiService } from './splitApiService';

export const useTransactionApiService = defineStore(
  'transactionApiService',
  () => {
    async function getTransactionsOfAccount(
      accountId: number,
      offset = 0,
      limit = 100
    ): Promise<Array<Transaction>> {
      const response = await axios.get(
        generateUrl('apps/money/transactions/for-account'),
        {
          params: {
            accountId: accountId,
            resultOffset: offset,
            resultLimit: limit
          }
        }
      );

      return response.data.map(createTransactionFromResponseData);
    }

    async function getUnbalancedTransactions(offset = 0, limit = 100) {
      const response = await axios.get(
        generateUrl('apps/money/transactions/unbalanced'),
        {
          params: {
            resultOffset: offset,
            resultLimit: limit
          }
        }
      );

      return response.data.map(createTransactionFromResponseData);
    }

    async function addTransaction(transaction: TransactionCreationData) {
      const data = {
        ...transaction,
        date: dayjs(transaction.date).format('YYYY-MM-DD')
      };

      const response = await axios.post(
        generateUrl('apps/money/transactions'),
        data
      );

      return createTransactionFromResponseData(response.data);
    }

    async function updateTransaction(transaction: Transaction) {
      const data = {
        ...transaction,
        date: dayjs(transaction.date).format('YYYY-MM-DD')
      };

      await axios.put(
        generateUrl(`apps/money/transactions/${transaction.id}`),
        data
      );
    }

    function createTransactionFromResponseData(data): Transaction {
      const splitApiService = useSplitApiService();
      const splitStore = useSplitStore();

      if (data.splits) {
        const splits = data.splits.map(
          splitApiService.createSplitFromResponseData
        );
        splitStore.insertSplits(splits);
      }

      return {
        id: data.id,
        description: data.description,
        date: new Date(data.date),
        timestampAdded: new Date(data.timestampAdded).valueOf()
      };
    }

    return {
      getTransactionsOfAccount,
      getUnbalancedTransactions,
      addTransaction,
      updateTransaction
    };
  }
);

export type TransactionCreationData = Omit<
  Transaction,
  'id' | 'timestampAdded'
>;
