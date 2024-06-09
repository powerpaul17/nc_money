import dayjs from 'dayjs';

import { useSplitApiService, type SplitCreationData } from './splitApiService';
import { useAccountStore } from '../stores/accountStore';
import { useSplitStore, type Split } from '../stores/splitStore';
import { useTransactionStore } from '../stores/transactionStore';

let splitService: SplitService | null = null;

export const useSplitService = (): SplitService => {
  if (!splitService) splitService = new SplitService();
  return splitService;
};

class SplitService {
  private splitStore = useSplitStore();
  private splitApiService = useSplitApiService();

  private transactionStore = useTransactionStore();
  private accountStore = useAccountStore();

  public async addSplit(
    split: SplitCreationData,
    addToStore = true
  ): Promise<Split> {
    const newSplit = await this.splitApiService.addSplit(split);

    if (addToStore) {
      await this.splitStore.insertSplit(newSplit);

      const transaction = await this.transactionStore.getById(
        newSplit.transactionId
      );

      this.accountStore.addValue({
        accountId: split.destAccountId,
        value: split.value,
        date: transaction?.date ? dayjs(transaction.date).toDate() : undefined
      });
    }

    return newSplit;
  }

  public async deleteSplit(split: Split): Promise<void> {
    await this.splitApiService.deleteSplit(split.id);
    await this.splitStore.deleteSplit(split.id);

    const transaction = await this.transactionStore.getById(
      split.transactionId
    );

    this.accountStore.addValue({
      accountId: split.destAccountId,
      value: -split.value,
      date: transaction?.date ? dayjs(transaction.date).toDate() : undefined
    });
  }

  public async updateSplit(split: Split): Promise<void> {
    await this.splitStore.insertSplit(
      await this.splitApiService.updateSplit(split)
    );
  }
}
