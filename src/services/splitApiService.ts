import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';
import type { AxiosResponse } from 'axios';

import { defineStore } from 'pinia';

import type { Split } from '../stores/splitStore';

export const useSplitApiService = defineStore('splitApiService', () => {

  async function addSplit(split: SplitCreationData): Promise<Split> {
    const response = await axios.post<
      SplitApiData,
      AxiosResponse<SplitApiData>,
      SplitCreationData
    >(generateUrl('apps/money/splits'), split);
    return createSplitFromResponseData(response.data);
  }

  async function deleteSplit(splitId: number): Promise<void> {
    await axios.delete(generateUrl(`apps/money/splits/${splitId}`));
  }

  async function updateSplit(split: Split): Promise<Split> {
    const response = await axios.put<
      SplitApiData,
      AxiosResponse<SplitApiData>,
      SplitApiData
    >(generateUrl(`apps/money/splits/${split.id}`), split);

    return createSplitFromResponseData(response.data);
  }

  function createSplitFromResponseData(data: SplitApiData): Split {
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

export type SplitApiData = Split;
