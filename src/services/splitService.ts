import { defineStore } from 'pinia';

import {
  useSplitApiService,
  type SplitCreationData
} from './splitApiService';
import { useAccountStore } from '../stores/accountStore';
import { useSplitStore, type Split } from '../stores/splitStore';
import { useTransactionStore } from '../stores/transactionStore';

export const useSplitService = defineStore('splitService', () => {
  const splitStore = useSplitStore();
  const splitApiService = useSplitApiService();

  const transactionStore = useTransactionStore();
  const accountStore = useAccountStore();

  async function addSplit(split: SplitCreationData, addToStore = true): Promise<Split> {
    const newSplit = await splitApiService.addSplit(split);

    if (addToStore) {
      await splitStore.insertSplit(newSplit);

      const transaction = await transactionStore.getById(newSplit.transactionId);

      accountStore.addValue(
        split.destAccountId,
        split.value,
        transaction?.date
      );
    }

    return newSplit;
  }

  async function deleteSplit(split: Split): Promise<void> {
    await splitApiService.deleteSplit(split.id);
    await splitStore.deleteSplit(split.id);

    const transaction = await transactionStore.getById(split.transactionId);
    accountStore.addValue(split.destAccountId, -split.value, transaction?.date);
  }

  async function updateSplit(split: Split): Promise<void> {
    await splitStore.insertSplit(
      await splitApiService.updateSplit(split)
    );
  }

  return {
    addSplit,
    deleteSplit,
    updateSplit
  };
});
