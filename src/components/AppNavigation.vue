<template>
  <NcAppNavigation>
    <template #list>
      <NcAppNavigationItem
        :title="t('money', 'Overview')"
        :to="'/'"
        :exact="true"
      >
        <template #icon>
          <Finance />
        </template>
      </NcAppNavigationItem>

      <NcAppNavigationSpacer class="order-none" />

      <AccountTypeListItem
        v-for="accountType in accountTypes"
        :key="accountType.type"
        :account-type="accountType"
        @show-details-changed="$event => emit('show-details-changed', $event)"
      />

      <li class="border-t border-solid border-border-dark" />

      <NcAppNavigationItem
        :title="t('money', 'Unbalanced')"
      >
        <template #counter>
          <CurrencyText
            class="mr-2"
            :value="unbalancedValue"
            :animation="true"
          />
        </template>
      </NcAppNavigationItem>

      <NcAppNavigationItem
        :title="t('money', 'Equity')"
      >
        <template #counter>
          <CurrencyText
            class="mr-2"
            :value="equity"
            :animation="true"
          />
        </template>
      </NcAppNavigationItem>
    </template>

    <template #footer>
      <AppSettings />
    </template>
  </NcAppNavigation>
</template>

<script setup lang="ts">

  import { computed } from 'vue';

  import NcAppNavigation from '@nextcloud/vue/dist/Components/NcAppNavigation';
  import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem';
  import NcAppNavigationSpacer from '@nextcloud/vue/dist/Components/NcAppNavigationSpacer';

  import Finance from 'vue-material-design-icons/Finance.vue';

  import AccountTypeListItem from './AccountTypeListItem.vue';
  import CurrencyText from './CurrencyText.vue';
  import AppSettings from './AppSettings.vue';

  import { useAccountStore } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';
  import { useAccountTypeStore } from '../stores/accountTypeStore';

  const accountStore = useAccountStore();
  const accountService = useAccountService();
  const accountTypeStore = useAccountTypeStore();

  const emit = defineEmits<{
    (event: 'show-details-changed', showDetails: boolean): void
  }>();

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
  void accountService.fetchAccounts();

</script>
