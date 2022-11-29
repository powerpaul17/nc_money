<template>
  <NcAppNavigationItem
    :title="account.name"
    :to="`/account/${props.account.id}`"
  >
    <template #counter>
      <CurrencyText
        class="mr-2"
        :value="balance"
        :animation="true"
        :inverted-value="settingStore.useInvertedAccounts && AccountTypeUtils.isInvertedAccount(account.type)"
      >
        <template
          #suffix
          v-if="AccountTypeUtils.isMonthlyAccount(account.type)"
        >
          / {{ t('money', 'mo') }}
        </template>
      </CurrencyText>
    </template>
  </NcAppNavigationItem>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';

  import { computed, type PropType } from 'vue';

  import type { Account } from '../stores/accountStore';
  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import { useSettingStore } from '../stores/settingStore';

  import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem';

  import CurrencyText from './CurrencyText.vue';

  const settingStore = useSettingStore();

  const props = defineProps({
    account: {
      type: Object as PropType<Account>,
      required: true
    }
  });

  const balance = computed(() => {
    if (AccountTypeUtils.isMonthlyAccount(props.account.type)) {
      const date = dayjs();
      return props.account.stats[date.year()]?.[date.month() + 1] ?? 0.0;
    } else {
      return props.account.balance;
    }
  });

</script>
