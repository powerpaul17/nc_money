<template>
  <ul>
    <AccountTypeListItem
      v-for="accountType in accountTypes"
      :key="accountType.id"
      :account-type="accountType"
    ></AccountTypeListItem>

    <li class="border-t border-solid border-color-border-dark"></li>

    <li>
      <router-link to="/accounts/unbalanced">
        <div class="flex w-full h-full">
          <div class="flex-auto overflow-hidden text-ellipsis">Unbalanced</div>
          <div class="flex-grow text-right">
          </div>
        </div>
      </router-link>
    </li>

    <li>
      <a href="#">
        <div class="flex w-full h-full">
          <div class="flex-auto overflow-hidden text-ellipsis">Equity</div>
          <div class="flex-grow text-right">
          </div>
        </div>
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useAccountStore } from '../stores/accountStore';

  import AccountTypeListItem from './AccountTypeListItem.vue';

  export default defineComponent({
    computed: {
      accountTypes: function () {
        return [
          {
            id: 0,
            name: 'Assets',
            balance: this.accountStore.assetsBalance
          },
          {
            id: 1,
            name: 'Liabilities',
            balance: this.accountStore.liabilitiesBalance
          },
          {
            id: 2,
            name: 'Income',
            balance: this.accountStore.incomeBalance
          },
          {
            id: 3,
            name: 'Expenses',
            balance: this.accountStore.expensesBalance
          }
        ];
      },
      equity: function () {
        return (
          this.accountStore.assetsBalance + this.accountStore.liabilitiesBalance
        );
      },
      unbalancedValue: function () {
        return this.accountStore.unbalancedValue;
      }
    },
    setup() {
      const accountStore = useAccountStore();
      accountStore.fillCache(); // TODO

      return { accountStore };
    },
    components: {
      AccountTypeListItem
    }
  });

  export type AccountType = {
    id: number;
    name: string;
    balance: number;
  };
</script>
