import { translate as t } from '@nextcloud/l10n';

import { defineStore } from 'pinia';
import { computed } from 'vue';

import { useAccountStore } from './accountStore';

export const useAccountTypeStore = defineStore('accountType', () => {

  const accountStore = useAccountStore();

  const _accountTypes: Map<AccountTypeType, AccountType> = new Map([
    [
      AccountTypeType.ASSET,
      {
        type: AccountTypeType.ASSET,
        name: t('money', 'Assets'),
        balance: accountStore.assetsBalance
      }],
    [
      AccountTypeType.LIABILITY,
      {
        type: AccountTypeType.LIABILITY,
        name: t('money', 'Liabilities'),
        balance: accountStore.liabilitiesBalance
      }],
    [
      AccountTypeType.INCOME,
      {
        type: AccountTypeType.INCOME,
        name: t('money', 'Income'),
        balance: accountStore.incomeBalance
      }],
    [
      AccountTypeType.EXPENSE,{
        type: AccountTypeType.EXPENSE,
        name: t('money', 'Expenses'),
        balance: accountStore.expensesBalance
      }]
  ]);

  const accountTypes = computed(() => {
    return Array.from(_accountTypes.values());
  });

  const getByType = computed(() => {
    return (accountType: AccountTypeType) => {
      return _accountTypes.get(accountType);
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
  balance: number;
};
