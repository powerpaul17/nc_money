import { afterEach, describe, expect, it } from 'vitest';

import { useAccountStore, type AccountStore, type Account, resetAccountStore } from './accountStore';
import { AccountTypeType } from './accountTypeStore';

describe('accountStore', () => {

  describe('getBalance', () => {

    it('should return the correct balance for a given year/month', () => {
      const { accountStore } = setupEnvironment();
      expect(accountStore.getBalance(1, 2023, 3)).to.equal(30);
    });

    it('should return the last balance for dates in the future', () => {
      const { accountStore } = setupEnvironment();
      expect(accountStore.getBalance(1, 2035, 1)).to.equal(110);
    });

    it('should return 0 as the balance before the first transaction', () => {
      const { accountStore } = setupEnvironment();
      expect(accountStore.getBalance(1, 2000, 1)).to.equal(0);
    });

    it('should return the correct interpolated balance for a month which has no transaction', () => {
      const { accountStore } = setupEnvironment();
      expect(accountStore.getBalance(1, 2023, 6)).to.equal(30);
    });

    it('should return 0 as the balance if account is empty', () => {
      const { accountStore } = setupEnvironment();
      accountStore.insertAccount({
        id: 10,
        name: '',
        description: '',
        currency: '',
        stats: {},
        type: AccountTypeType.ASSET,
        extraData: {}
      });
      expect(accountStore.getBalance(10)).to.equal(0);
    });

  });

  describe('getSummary', () => {

    it('should return the correct summary for a given year/month', () => {
      const { accountStore } = setupEnvironment();
      expect(accountStore.getSummary(1, 2023, 3)).to.equal(30);
    });

    it('should not return a summary if there are no transactions in a given month', () => {
      const { accountStore } = setupEnvironment();

      expect(accountStore.getSummary(1, 2000, 1)).to.equal(0);
      expect(accountStore.getSummary(1, 2023, 5)).to.equal(0);
      expect(accountStore.getSummary(1, 2030, 1)).to.equal(0);
    });

  });

  describe('addValue', () => {

    it('should add the value if it does not exist', () => {
      const { accountStore, account } = setupEnvironment();

      const date = new Date('2023-06-30');
      accountStore.addValue(1, 123.4, date);

      expect(cloneRecursively(account.stats)).to.deep.equal({
        2023: {
          3: {
            value: 30,
            balance: 30
          },
          6: {
            value: 123.4,
            balance: 153.4
          },
          8: {
            value: 80,
            balance: 233.4
          }
        }
      });
    });

    it('should add the value to an existing month', () => {
      const { accountStore, account } = setupEnvironment();

      const date = new Date('2023-08-30');
      accountStore.addValue(1, 123.4, date);

      expect(cloneRecursively(account.stats)).to.deep.equal({
        2023: {
          3: {
            value: 30,
            balance: 30
          },
          8: {
            value: 203.4,
            balance: 233.4
          }
        }
      });
    });

  });

  afterEach(() => {
    resetAccountStore();
  });

  function setupEnvironment(): {
    accountStore: AccountStore;
    account: Account;
  } {
    const accountStore = useAccountStore();

    accountStore.insertAccount({
      currency: '',
      description: '',
      id: 1,
      name: 'TestAccount',
      type: AccountTypeType.ASSET,
      extraData: {},
      stats: {
        2023: {
          3: {
            value: 30,
            balance: 30
          },
          8: {
            value: 80,
            balance: 110
          }
        }
      }
    });

    const account = accountStore.getById(1);

    return {
      accountStore,
      account: account!
    };
  }

  function cloneRecursively(obj: Record<string, AnyType>): Record<string, AnyType> {
    const clone: Record<string, AnyType> = {};

    for (const [ key, value ] of Object.entries(obj)) {
      if (typeof value !== 'object') {
        clone[key] = value;
      } else {
        clone[key] = cloneRecursively(value);
      }
    }
    return clone;
  }

});

type AnyType = string | number | RecordOfAnyType;

interface RecordOfAnyType extends Record<string, AnyType> {}
