<template>
  <ul>
    <AccountTypeListItem
      v-for="accountType in accountTypes"
      :key="accountType.type"
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
  import { useAccountTypeStore } from '../stores/accountTypeStore';

  import AccountTypeListItem from './AccountTypeListItem.vue';
  import CurrencyText from './CurrencyText.vue';

  export default defineComponent({
    data() {
      return {
        accountStore: useAccountStore(),
        accountService: useAccountService(),
        accountTypeStore: useAccountTypeStore()
      };
    },
    computed: {
      accountTypes() {
        return this.accountTypeStore.accountTypes;
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
</script>
