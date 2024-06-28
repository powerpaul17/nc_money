import {
  fireEvent,
  getAllByRole,
  getByText,
  render,
  screen,
  type RenderOptions
} from '@testing-library/vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import AccountSelect from './AccountSelect.vue';

import { resetAccountStore, useAccountStore } from '../stores/accountStore';
import { AccountTypeType } from '../stores/accountTypeStore';

describe('AccountSelect', () => {
  it('should show the empty value if no account is selected', async () => {
    await setupEnvironment();
    screen.getByPlaceholderText('-- No Account --');
  });

  it('should show the currently selected account', async () => {
    const { createAccount, updateProps } = await setupEnvironment();

    createAccount({ name: 'Test-Account' });

    await updateProps({
      bookId: 0,
      accountId: 0
    });

    screen.getByText(/^Test-Account/);
  });

  it('should open a dropdown if clicked', async () => {
    const { createAccount } = await setupEnvironment();

    createAccount({ name: 'Test-Account' });

    const element = screen.getByPlaceholderText('-- No Account --');
    await fireEvent.mouseDown(element);

    const dropdown = screen.getByRole('listbox');

    getByText(dropdown, 'Test-Account');
  });

  it('should emit an event if another account is selected', async () => {
    const accountChangedSpy = vi.fn();

    const { createAccount } = await setupEnvironment({
      renderOptions: {
        props: {
          bookId: 0,
          'onAccount-changed': accountChangedSpy
        }
      }
    });

    createAccount({ name: 'Test-Account' });

    const element = screen.getByPlaceholderText('-- No Account --');
    await fireEvent.mouseDown(element);

    const dropdown = screen.getByRole('listbox');

    const items = getAllByRole(dropdown, 'option');
    await fireEvent.click(items[0]!);

    expect(accountChangedSpy.mock.calls[0]).toEqual([0]);
  });

  describe('filter account list', () => {
    it('should not filter the list without input value', async () => {
      const { createAccount } = await setupEnvironment();

      ['Account 1', 'Asset 1', 'Liability', 'My credit card'].forEach((name) =>
        createAccount({ name })
      );

      const element = screen.getByPlaceholderText('-- No Account --');
      await fireEvent.mouseDown(element);

      const dropdown = screen.getByRole('listbox');

      await fireEvent.input(element, {
        target: { value: '' }
      });

      expect(
        getAllByRole(dropdown, 'option').map((e) => e.textContent)
      ).toEqual([
        'Account 1Ass. ',
        'Asset 1Ass. ',
        'LiabilityAss. ',
        'My credit cardAss. '
      ]);
    });

    it('should filter the list according to the input value', async () => {
      const { createAccount } = await setupEnvironment();

      ['Account 1', 'Asset 1', 'Liability', 'My credit card'].forEach((name) =>
        createAccount({ name })
      );

      const element = screen.getByPlaceholderText('-- No Account --');
      await fireEvent.mouseDown(element);

      const dropdown = screen.getByRole('listbox');

      await fireEvent.input(element, {
        target: { value: 'iabil' }
      });

      expect(
        getAllByRole(dropdown, 'option').map((e) => e.textContent)
      ).toEqual(['LiabilityAss. ']);
    });

    it('should ignore diacritics and umlauts', async () => {
      const { createAccount } = await setupEnvironment();

      ['Without umlaut', 'Bankgebühren', 'Héllo', 'Baño nuevo'].forEach(
        (name) => createAccount({ name })
      );

      const element = screen.getByPlaceholderText('-- No Account --');
      await fireEvent.mouseDown(element);

      const dropdown = screen.getByRole('listbox');

      await fireEvent.input(element, {
        target: { value: 'gebu' }
      });

      expect(
        getAllByRole(dropdown, 'option').map((e) => e.textContent)
      ).toEqual(['BankgebührenAss. ']);

      await fireEvent.input(element, {
        target: { value: 'bano' }
      });

      expect(
        getAllByRole(dropdown, 'option').map((e) => e.textContent)
      ).toEqual(['Baño nuevoAss. ']);

      await fireEvent.input(element, {
        target: { value: 'ell' }
      });

      expect(
        getAllByRole(dropdown, 'option').map((e) => e.textContent)
      ).toEqual(['HélloAss. ']);
    });
  });

  afterEach(() => {
    resetAccountStore();
  });

  async function setupEnvironment(options?: {
    renderOptions?: RenderOptions<typeof AccountSelect>;
  }): Promise<{
    createAccount: ({
      bookId,
      name
    }: {
      bookId?: number;
      name: string;
    }) => void;
    updateProps: (
      props: NonNullable<RenderOptions<typeof AccountSelect>['props']>
    ) => Promise<void>;
  }> {
    const renderResult = render(
      AccountSelect,
      options?.renderOptions ?? {
        props: {
          bookId: 0
        }
      }
    );

    await nextTick();

    const accountStore = useAccountStore();

    let accountId = 0;

    return {
      createAccount: ({ bookId = 0, name }) =>
        accountStore.insertAccount({
          bookId,
          currency: 'EUR',
          description: '',
          id: accountId++,
          name,
          stats: {},
          extraData: {},
          type: AccountTypeType.ASSET
        }),
      updateProps: (props) => renderResult.rerender(props)
    };
  }
});
