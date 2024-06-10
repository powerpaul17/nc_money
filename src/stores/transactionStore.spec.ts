import { afterEach, describe, expect, it } from 'vitest';

import dayjs from 'dayjs';

import {
  resetTransactionStore,
  useTransactionStore,
  type Transaction
} from './transactionStore';
import { resetSplitStore, useSplitStore } from './splitStore';
import { resetAccountStore, useAccountStore } from './accountStore';
import { AccountTypeType } from './accountTypeStore';

describe('transactionStore', () => {
  it('should insert a new transaction', async () => {
    const transactionStore = useTransactionStore();

    const transaction: Transaction = {
      id: 0,
      description: '',
      date: '2024-01-01',
      timestampAdded: Date.now()
    };

    await transactionStore.insertTransaction(transaction);

    expect(await transactionStore.getSortedByDate()).to.deep.equal([
      transaction
    ]);
  });

  it('should not insert the same transaction twice', async () => {
    const transactionStore = useTransactionStore();

    const transaction: Transaction = {
      id: 0,
      description: '',
      date: '2024-01-01',
      timestampAdded: Date.now()
    };

    await transactionStore.insertTransaction(transaction);
    await transactionStore.insertTransaction(transaction);

    expect(await transactionStore.getSortedByDate()).to.deep.equal([
      transaction
    ]);
  });

  it('should return a transaction by id', async () => {
    const transactionStore = useTransactionStore();

    const transaction1: Transaction = {
      id: 0,
      description: '',
      date: '2024-01-01',
      timestampAdded: Date.now()
    };
    const transaction2: Transaction = {
      id: 1,
      description: '',
      date: '2024-01-01',
      timestampAdded: Date.now()
    };

    await transactionStore.insertTransactions([transaction1, transaction2]);

    expect(await transactionStore.getById(0)).to.deep.equal(transaction1);
  });

  it('should return transactions by account id', async () => {
    const transactionStore = useTransactionStore();
    const splitStore = useSplitStore();

    const accountStore = useAccountStore();
    accountStore.insertAccount({
      id: 0,
      bookId: 0,
      name: 'account0',
      description: '',
      currency: '',
      type: AccountTypeType.ASSET,
      stats: {},
      extraData: {}
    });
    accountStore.insertAccount({
      id: 1,
      bookId: 0,
      name: 'account1',
      description: '',
      currency: '',
      type: AccountTypeType.ASSET,
      stats: {},
      extraData: {}
    });

    const transaction1: Transaction = {
      id: 0,
      description: '',
      date: '2024-01-01',
      timestampAdded: Date.now()
    };
    const split1 = {
      id: 0,
      description: '',
      value: 12.345,
      convertRate: 1.0,
      transactionId: transaction1.id,
      destAccountId: 0
    };

    const transaction2: Transaction = {
      id: 1,
      description: '',
      date: '2024-01-01',
      timestampAdded: Date.now()
    };
    const split2 = {
      id: 1,
      description: '',
      value: 12.345,
      convertRate: 1.0,
      transactionId: transaction2.id,
      destAccountId: 1
    };

    await transactionStore.insertTransactions([transaction1, transaction2]);
    await splitStore.insertSplits([split1, split2]);

    expect(await transactionStore.getByAccountId(0)).to.deep.equal([
      transaction1
    ]);
  });

  it('should return transactions sorted by date', async () => {
    const transactionStore = useTransactionStore();

    const date = dayjs();

    const transaction1: Transaction = {
      id: 0,
      description: '',
      date: date.format('YYYY-MM-DD'),
      timestampAdded: Date.now()
    };
    const transaction2: Transaction = {
      id: 1,
      description: '',
      date: date.add(1, 'day').format('YYYY-MM-DD'),
      timestampAdded: Date.now()
    };

    await transactionStore.insertTransactions([transaction1, transaction2]);

    expect(await transactionStore.getSortedByDate()).to.deep.equal([
      transaction2,
      transaction1
    ]);
  });

  it('should delete a transaction', async () => {
    const transactionStore = useTransactionStore();

    const transaction1: Transaction = {
      id: 0,
      description: '',
      date: '2024-01-01',
      timestampAdded: Date.now()
    };
    const transaction2: Transaction = {
      id: 1,
      description: '',
      date: '2024-01-01',
      timestampAdded: Date.now()
    };

    await transactionStore.insertTransactions([transaction1, transaction2]);
    await transactionStore.deleteTransaction(transaction1.id);

    expect(await transactionStore.getSortedByDate()).to.deep.equal([
      transaction2
    ]);
  });

  afterEach(() => {
    resetTransactionStore();
    resetSplitStore();
    resetAccountStore();
  });
});
