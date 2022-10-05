<template>
  <ul>
    <AccountTypeListItem
      v-for="accountType in accountTypes"
      :key="accountType.id"
      :account-type="accountType"
    />

    <li class="border-t border-solid border-border-dark" />

    <li>
      <router-link to="/accounts/unbalanced">
        <div class="flex h-full w-full">
          <div class="flex-auto overflow-hidden text-ellipsis">
            {{ t('money', 'Unbalanced') }}
          </div>
          <div class="grow text-right">
            <CurrencyText
              :value="unbalancedValue"
              :animation="true"
            />
          </div>
        </div>
      </router-link>
    </li>

    <li>
      <a href="#">
        <div class="flex h-full w-full">
          <div class="flex-auto overflow-hidden text-ellipsis">
            {{ t('money', 'Equity') }}
          </div>
          <div class="grow text-right">
            <CurrencyText
              :value="equity"
              :animation="true"
            />
          </div>
        </div>
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useAccountStore } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';

  import AccountTypeListItem from './AccountTypeListItem.vue';
  import CurrencyText from './CurrencyText.vue';

  export default defineComponent({
    data() {
      return {
        accountStore: useAccountStore(),
        accountService: useAccountService()
      };
    },
    computed: {
      accountTypes() {
        return [
          {
            id: 0,
            name: this.t('money', 'Assets'),
            balance: this.accountStore.assetsBalance
          },
          {
            id: 1,
            name: this.t('money', 'Liabilities'),
            balance: this.accountStore.liabilitiesBalance
          },
          {
            id: 2,
            name: this.t('money', 'Income'),
            balance: this.accountStore.incomeBalance
          },
          {
            id: 3,
            name: this.t('money', 'Expenses'),
            balance: this.accountStore.expensesBalance
          }
        ];
      },
      equity() {
        return (
          this.accountStore.assetsBalance + this.accountStore.liabilitiesBalance
        );
      },
      unbalancedValue() {
        return this.accountStore.unbalancedValue;
      }
    },
    created() {
      this.accountService.fillCache(); // TODO
    },
    components: {
      AccountTypeListItem,
      CurrencyText
    }
  });

  export type AccountType = {
    id: number;
    name: string;
    balance: number;
  };
</script>
