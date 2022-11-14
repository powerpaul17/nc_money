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

<script setup lang="ts">

  import { computed } from 'vue';

  import { useAccountStore } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';
  import { useAccountTypeStore } from '../stores/accountTypeStore';

  import AccountTypeListItem from './AccountTypeListItem.vue';
  import CurrencyText from './CurrencyText.vue';

  const accountStore = useAccountStore();
  const accountService = useAccountService();
  const accountTypeStore = useAccountTypeStore();

  const accountTypes = computed(() => {
    return accountTypeStore.accountTypes;
  });

  const equity = computed(() => {
    return (
      accountStore.assetsBalance + accountStore.liabilitiesBalance
    );
  });

  const unbalancedValue = computed(() => {
    return accountStore.unbalancedValue;
  });

  // TODO: initialize accounts at some other point
  accountService.fetchAccounts();

</script>
