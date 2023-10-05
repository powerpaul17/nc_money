import { translate as t } from '@nextcloud/l10n';

import { computed, type Ref } from 'vue';

import { useAccountStore } from './accountStore';

let accountTypeStore: AccountTypeStore|null = null;

export const useAccountTypeStore = (): AccountTypeStore => {
  if (!accountTypeStore) accountTypeStore = new AccountTypeStore();
  return accountTypeStore;
};

export function resetAccountTypeStore(): void {
  accountTypeStore = null;
}

class AccountTypeStore {

  private accountStore = useAccountStore();

  public readonly accountTypes: Array<AccountType> = [
    {
      type: AccountTypeType.ASSET,
      name: t('money', 'Assets'),
      balance: this.accountStore.assetsBalance
    },
    {
      type: AccountTypeType.LIABILITY,
      name: t('money', 'Liabilities'),
      balance: this.accountStore.liabilitiesBalance
    },
    {
      type: AccountTypeType.INCOME,
      name: t('money', 'Income'),
      balance: this.accountStore.incomeBalance
    },
    {
      type: AccountTypeType.EXPENSE,
      name: t('money', 'Expenses'),
      balance: this.accountStore.expensesBalance
    }
  ];

  public getByType(accountType: AccountTypeType): AccountType|undefined {
    return this.accountTypes.find(aT => aT.type === accountType);
  }

}

export enum AccountTypeType {
  ASSET = 0,
  LIABILITY = 1,
  INCOME = 2,
  EXPENSE = 3
}

export type AccountType = {
  type: AccountTypeType;
  name: string;
  balance: Ref<number>;
};
