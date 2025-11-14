import {
  fireEvent,
  getByPlaceholderText,
  render,
  RenderResult,
  screen
} from '@testing-library/vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import SplitInput from './SplitInput.vue';
import { resetSplitStore, Split, useSplitStore } from '../stores/splitStore';
import { resetAccountStore, useAccountStore } from '../stores/accountStore';
import { AccountTypeType } from '../stores/accountTypeStore';
import { CurrencyInputTestUtils } from './CurrencyInputTestUtils';

vi.mock('@nextcloud/axios', () => {
  return {
    default: {
      put: () => ({ data: '' })
    }
  };
});

describe('SplitInput', () => {
  'should not show the convert rate input when currency of accounts are the same';
  'should show the convert rate input when currency of accounts differ';

  it('should show the value of the split for the same source account', async () => {
    await setupEnvironment({
      splitData: {
        value: 120,
        convertRate: 1.2
      }
    });

    const element = screen.getByPlaceholderText('Value...');

    expect(element.value).to.equal('120.00');
  });

  it('should show the corrected value for another source account', async () => {
    await setupEnvironment({
      splitData: {
        value: 120,
        convertRate: 1.2
      },
      sourceData: {
        hasDifferentCurrency: true,
        value: -288,
        convertRate: 0.5
      }
    });

    const element = screen.getByPlaceholderText('Value...');

    expect(element.value).to.equal('288.00');
  });

  describe('change value', () => {
    it('...', async () => {
      const { renderResult } = await setupEnvironment({
        splitData: {
          value: 120,
          convertRate: 1.2
        }
      });

      const input = getByPlaceholderText(renderResult.baseElement, 'Value...');
      CurrencyInputTestUtils.enterValue(input, '150');

      const element = screen.getByPlaceholderText('Value...');

      expect(element.value).to.equal('150.00');
    });
  });

  describe('change convertRate', () => {});

  afterEach(() => {
    resetSplitStore();
    resetAccountStore();
  });

  async function setupEnvironment({
    splitData,
    sourceData
  }: {
    splitData: Pick<Split, 'value' | 'convertRate'>;
    sourceData?: {
      hasDifferentCurrency: boolean;
      value: number;
      convertRate: number;
    };
  }): Promise<{
    renderResult: RenderResult;
  }> {
    const splitStore = useSplitStore();
    const accountStore = useAccountStore();

    let splitId = 0;
    let accountId = 0;

    const account = accountStore.insertAccount({
      id: accountId++,
      bookId: 0,
      currency: '',
      description: '',
      extraData: {},
      name: '',
      stats: {},
      type: AccountTypeType.ASSET
    });

    const split = await splitStore.insertSplit({
      id: splitId++,
      transactionId: 0,
      destAccountId: account.id,
      description: '',
      value: splitData.value,
      convertRate: splitData.convertRate
    });

    const sourceAccount = sourceData
      ? accountStore.insertAccount({
          id: accountId++,
          bookId: 0,
          currency: sourceData.hasDifferentCurrency ? 'A' : '',
          description: '',
          extraData: {},
          type: AccountTypeType.ASSET,
          name: '',
          stats: {}
        })
      : account;

    if (sourceData) {
      await splitStore.insertSplit({
        id: splitId++,
        transactionId: 0,
        description: '',
        destAccountId: sourceAccount.id,
        value: sourceData.value,
        convertRate: sourceData.convertRate
      });
    }

    const renderResult = render(SplitInput, {
      props: {
        bookId: 0,
        split,
        sourceAccountId: sourceAccount.id
      }
    });

    await nextTick();

    return { renderResult };
  }
});
