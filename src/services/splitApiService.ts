import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';

import { defineStore } from 'pinia';

import type { Split } from '../stores/splitStore';
import { useAccountStore } from '../stores/accountStore';
import { useTransactionStore } from '../stores/transactionStore';

export const useSplitApiService = defineStore('splitApiService', () => {
  async function addSplit(split: SplitCreationData) {
    const response = await axios.post(generateUrl('apps/money/splits'), split);
    return createSplitFromResponseData(response.data);
  }

  async function deleteSplit(splitId: number) {
    await axios.delete(generateUrl(`apps/money/splits/${splitId}`));
  }

  async function updateSplit(split: Split) {
    await axios.put(generateUrl(`apps/money/splits/${split.id}`), split);
  }

  function createSplitFromResponseData(data): Split {
    return new Proxy(
      {
        id: data.id,
        transactionId: data.transactionId,
        destAccountId: data.destAccountId,
        description: data.description,
        value: data.value,
        convertRate: data.convertRate
      },
      {
        set(target, p, value, receiver) {
          console.warn('SPLIT PROXY -->', target, p, value, receiver);

          const accountStore = useAccountStore();
          const transactionStore = useTransactionStore();

          const transaction = transactionStore.getById(target.transactionId);

          if (p === 'value') {
            const diff = value - target.value;
            accountStore.addValue(
              target.destAccountId,
              diff,
              transaction?.date
            );
          } else if (p === 'destAccountId') {
            accountStore.addValue(
              target.destAccountId,
              -target.value,
              transaction?.date
            );
            accountStore.addValue(value, target.value, transaction?.date);
          }

          target[p] = value;

          return true;
        }
      }
    );
  }

  return {
    addSplit,
    deleteSplit,
    updateSplit,
    createSplitFromResponseData
  };
});

export type SplitCreationData = Omit<Split, 'id'>;
