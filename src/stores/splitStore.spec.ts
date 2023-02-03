import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { useSplitStore } from './splitStore';
import { useAccountStore } from './accountStore';

describe('splitStore', () => {

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should insert a new split', async () => {
    const splitStore = useSplitStore();

    const split = {
      id: 0,
      description: '',
      value: 12.345,
      convertRate: 1.0,
      transactionId: 0,
      destAccountId: 0
    };

    await splitStore.insertSplit(split);

    expect(await splitStore.getByTransactionId(0)).to.deep.equal([ split ]);
  });

  it('should not insert the same split twice', async () => {
    const splitStore = useSplitStore();

    const accountStore = useAccountStore();
    accountStore.insertAccount({
      id: 0,
      balance: 0.0,
      currency: '',
      description: '',
      name: '',
      stats: {},
      type: 0
    });

    const split = {
      id: 0,
      description: '',
      value: 12.345,
      convertRate: 1.0,
      transactionId: 0,
      destAccountId: 0
    };

    await splitStore.insertSplit(split);
    await splitStore.insertSplit(split);

    expect(await splitStore.getByTransactionId(0)).to.deep.equal([ split ]);
  });

  it('should return a split by id', async () => {
    const splitStore = useSplitStore();

    const split1 = {
      id: 0,
      description: '',
      value: 12.345,
      convertRate: 1.0,
      transactionId: 0,
      destAccountId: 0
    };
    const split2 = {
      id: 1,
      description: '',
      value: 12.345,
      convertRate: 1.0,
      transactionId: 0,
      destAccountId: 1
    };

    await splitStore.insertSplits([ split1, split2 ]);

    expect(await splitStore.getById(0)).to.deep.equal(split1);
  });

  it('should return splits by account id', async () => {
    const splitStore = useSplitStore();

    const split1 = {
      id: 0,
      description: '',
      value: 12.345,
      convertRate: 1.0,
      transactionId: 0,
      destAccountId: 0
    };
    const split2 = {
      id: 1,
      description: '',
      value: 12.345,
      convertRate: 1.0,
      transactionId: 0,
      destAccountId: 1
    };

    await splitStore.insertSplits([ split1, split2 ]);

    expect(await splitStore.getByAccountId(0)).to.deep.equal([ split1 ]);
  });

  it('should return splits by transaction id', async () => {
    const splitStore = useSplitStore();

    const split1 = {
      id: 0,
      description: '',
      value: 12.345,
      convertRate: 1.0,
      transactionId: 0,
      destAccountId: 0
    };
    const split2 = {
      id: 1,
      description: '',
      value: 12.345,
      convertRate: 1.0,
      transactionId: 1,
      destAccountId: 0
    };

    await splitStore.insertSplits([ split1, split2 ]);

    expect(await splitStore.getByTransactionId(0)).to.deep.equal([ split1 ]);
  });

  it('should delete a split', async () => {
    const splitStore = useSplitStore();

    const split1 = {
      id: 0,
      description: '',
      value: 12.345,
      convertRate: 1.0,
      transactionId: 0,
      destAccountId: 0
    };
    const split2 = {
      id: 1,
      description: '',
      value: 12.345,
      convertRate: 1.0,
      transactionId: 0,
      destAccountId: 0
    };

    await splitStore.insertSplits([ split1, split2 ]);
    await splitStore.deleteSplit(split1.id);

    expect(await splitStore.getByTransactionId(0)).to.deep.equal([ split2 ]);
  });

});
