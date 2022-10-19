import { AccountTypeType } from '../stores/accountTypeStore';

export class AccountTypeUtils {

  public static isMonthlyAccount(accountType: AccountTypeType): boolean {
    return [
      AccountTypeType.INCOME,
      AccountTypeType.EXPENSE
    ].includes(accountType);
  }

}
