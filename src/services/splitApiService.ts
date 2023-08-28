import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';
import type { AxiosResponse } from 'axios';

import type { Split } from '../stores/splitStore';

let splitApiService: SplitApiService|null = null;

export const useSplitApiService = (): SplitApiService => {
  if (!splitApiService) splitApiService = new SplitApiService();
  return splitApiService;
};

class SplitApiService {

  public async addSplit(split: SplitCreationData): Promise<Split> {
    const response = await axios.post<
      SplitApiData,
      AxiosResponse<SplitApiData>,
      SplitCreationData
    >(generateUrl('apps/money/splits'), split);
    return this.createSplitFromResponseData(response.data);
  }

  public async deleteSplit(splitId: number): Promise<void> {
    await axios.delete(generateUrl(`apps/money/splits/${splitId}`));
  }

  public async updateSplit(split: Split): Promise<Split> {
    const response = await axios.put<
      SplitApiData,
      AxiosResponse<SplitApiData>,
      SplitApiData
    >(generateUrl(`apps/money/splits/${split.id}`), split);

    return this.createSplitFromResponseData(response.data);
  }

  public createSplitFromResponseData(data: SplitApiData): Split {
    return {
      id: data.id,
      transactionId: data.transactionId,
      destAccountId: data.destAccountId,
      description: data.description,
      value: data.value,
      convertRate: data.convertRate
    };
  }

}

export type SplitCreationData = Omit<Split, 'id'>;

export type SplitApiData = Split;
