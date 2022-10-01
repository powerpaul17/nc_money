import { defineStore } from 'pinia';

import {
  useSplitApiService,
  type SplitCreationData
} from '../services/splitApiService';
import { useAccountStore } from './accountStore';
import { useSplitStore, type Split } from './splitStore';

export const useSplitService = defineStore('splitService', () => {
  const splitStore = useSplitStore();
  const splitApiService = useSplitApiService();

  const accountStore = useAccountStore();

  async function addSplit(split: SplitCreationData, addToStore = true) {
    const newSplit = await splitApiService.addSplit(split);

    if (addToStore) {
      splitStore.insertSplit(newSplit);

      accountStore.addValue(split.destAccountId, split.value);
    }

    return newSplit;
  }

  async function deleteSplit(split: Split) {
    await splitApiService.deleteSplit(split.id);
    splitStore.deleteSplit(split.id);

    accountStore.addValue(split.destAccountId, -split.value);
  }

  async function updateSplit(split: Split) {
    await splitApiService.updateSplit(split);
  }

  return {
    addSplit,
    deleteSplit,
    updateSplit
  };
});
