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

}
