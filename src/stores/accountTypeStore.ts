import { translate as t } from '@nextcloud/l10n';

import { defineStore, storeToRefs } from 'pinia';

import { computed, type Ref } from 'vue';

import { useAccountStore } from './accountStore';

export const useAccountTypeStore = defineStore('accountTypeStore', () => {

  const accountStore = storeToRefs(useAccountStore());

  const accountTypes: Array<AccountType> = [
    {
      type: AccountTypeType.ASSET,
      name: t('money', 'Assets'),
      balance: accountStore.assetsBalance
    },
    {
      type: AccountTypeType.LIABILITY,
      name: t('money', 'Liabilities'),
      balance: accountStore.liabilitiesBalance
    },
    {
      type: AccountTypeType.INCOME,
      name: t('money', 'Income'),
      balance: accountStore.incomeBalance
    },
    {
      type: AccountTypeType.EXPENSE,
      name: t('money', 'Expenses'),
      balance: accountStore.expensesBalance
    }
  ];

  const getByType = computed(() => {
    return (accountType: AccountTypeType): AccountType|undefined => {
      return accountTypes.find(aT => aT.type === accountType);
    };
  });

  return {
    accountTypes,
    getByType
  };
});

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
