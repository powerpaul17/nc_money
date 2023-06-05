import { translate } from '@nextcloud/l10n';

import { AccountTypeType } from '../stores/accountTypeStore';

export class AccountTypeUtils {

  public static isMonthlyAccount(accountType: AccountTypeType): boolean {
    return [
      AccountTypeType.INCOME,
      AccountTypeType.EXPENSE
    ].includes(accountType);
  }

  public static isInvertedAccount(accountType: AccountTypeType): boolean {
    return [
      AccountTypeType.INCOME,
      AccountTypeType.LIABILITY
    ].includes(accountType);
  }

  public static getNameOfAccountType(accountType: AccountTypeType, plural = false): string {
    switch (accountType) {
      case AccountTypeType.ASSET:
        return plural ? translate('money', 'Assets') : translate('money', 'Asset');

      case AccountTypeType.LIABILITY:
        return plural ? translate('money', 'Liabilities') : translate('money', 'Liability');

      case AccountTypeType.EXPENSE:
        return plural ? translate('money', 'Expenses') : translate('money', 'Expense');

      case AccountTypeType.INCOME:
        return translate('money', 'Income');
    }
  }

  public static getAbbreviationOfAccountType(accountType: AccountTypeType): string {
    switch (accountType) {
      case AccountTypeType.ASSET:
        return translate('money', 'Ass.');

      case AccountTypeType.LIABILITY:
        return translate('money', 'Lia.');

      case AccountTypeType.EXPENSE:
        return translate('money', 'Exp.');

      case AccountTypeType.INCOME:
        return translate('money', 'Inc.');
    }
  }

}
