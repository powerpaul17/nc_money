import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { useSplitStore } from './splitStore';

describe('splitStore', () => {

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should insert a new split', () => {
    const splitStore = useSplitStore();

    const split = {
      id: 0,
      description: '',
      value: 12.345,
      convertRate: 1.0,
      transactionId: 0,
      destAccountId: 0
    };

    splitStore.insertSplit(split);

    expect(splitStore.getByAccountId(0)).to.deep.equal([ split ]);
  });

  it('should not insert the same split twice', () => {
    const splitStore = useSplitStore();

    const split = {
      id: 0,
      description: '',
      value: 12.345,
      convertRate: 1.0,
      transactionId: 0,
      destAccountId: 0
    };

    splitStore.insertSplit(split);
    splitStore.insertSplit(split);

    expect(splitStore.getByAccountId(0)).to.deep.equal([ split ]);
  });

  it('should return a split by id', () => {
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

    splitStore.insertSplits([ split1, split2 ]);

    expect(splitStore.getById(0)).to.deep.equal(split1);
  });

  it('should return splits by account id', () => {
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

    splitStore.insertSplits([ split1, split2 ]);

    expect(splitStore.getByAccountId(0)).to.deep.equal([ split1 ]);
  });

  it('should return splits by transaction id', () => {
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

    splitStore.insertSplits([ split1, split2 ]);

    expect(splitStore.getByTransactionId(0)).to.deep.equal([ split1 ]);
  });

  it('should delete a split', () => {
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

    splitStore.insertSplits([ split1, split2 ]);
    splitStore.deleteSplit(split1.id);

    expect(splitStore.getByAccountId(0)).to.deep.equal([ split2 ]);
  });

});
