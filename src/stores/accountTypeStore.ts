import { translate as t } from '@nextcloud/l10n';

let accountTypeStore: AccountTypeStore | null = null;

export const useAccountTypeStore = (): AccountTypeStore => {
  if (!accountTypeStore) accountTypeStore = new AccountTypeStore();
  return accountTypeStore;
};

export function resetAccountTypeStore(): void {
  accountTypeStore = null;
}

class AccountTypeStore {
  public readonly accountTypes: Array<AccountType> = [
    {
      type: AccountTypeType.ASSET,
      name: t('money', 'Assets')
    },
    {
      type: AccountTypeType.LIABILITY,
      name: t('money', 'Liabilities')
    },
    {
      type: AccountTypeType.INCOME,
      name: t('money', 'Income')
    },
    {
      type: AccountTypeType.EXPENSE,
      name: t('money', 'Expenses')
    }
  ];

  public getByType(accountType: AccountTypeType): AccountType | undefined {
    return this.accountTypes.find((aT) => aT.type === accountType);
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
};
