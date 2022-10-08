import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';

import { defineStore } from 'pinia';

import type { Split } from '../stores/splitStore';

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
    return {
      id: data.id,
      transactionId: data.transactionId,
      destAccountId: data.destAccountId,
      description: data.description,
      value: data.value,
      convertRate: data.convertRate
    };
  }

  return {
    addSplit,
    deleteSplit,
    updateSplit,
    createSplitFromResponseData
  };
});

export type SplitCreationData = Omit<Split, 'id'>;
