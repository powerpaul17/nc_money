import {
  useAccountApiService,
  type AccountCreationData
} from './accountApiService';
import { useAccountStore, type Account } from '../stores/accountStore';

let accountService: AccountService|null = null;

export const useAccountService = (): AccountService => {
  if (!accountService) accountService = new AccountService();
  return accountService;
};
class AccountService {

  private accountStore = useAccountStore();
  private accountApiService = useAccountApiService();

  public async fetchAccounts(): Promise<void> {
    const accounts = await this.accountApiService.getAccounts();
    for (const account of accounts) {
      this.accountStore.insertAccount(account);
    }
  }

  public async refreshAccount(accountId: number): Promise<void> {
    const account = await this.accountApiService.getAccount(accountId);
    this.accountStore.insertAccount(account);
  }

  public async addAccount(account: AccountCreationData): Promise<Account> {
    const newAccount = await this.accountApiService.addAccount(account);
    this.accountStore.insertAccount(newAccount);

    return newAccount;
  }

  public async updateAccount(account: Account): Promise<void> {
    await this.accountApiService.updateAccount(account);
  }

  public async deleteAccount(accountId: number): Promise<void> {
    await this.accountApiService.deleteAccount(accountId);
    this.accountStore.deleteAccount(accountId);
  }

}
