<template>
  <NcAppNavigationItem
    :title="account.name"
    :to="`/account/${account.id}`"
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

<script lang="ts">
  import dayjs from 'dayjs';

  import { defineComponent, type PropType } from 'vue';

  import type { Account } from '../stores/accountStore';
  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import { useSettingStore } from '../stores/settingStore';

  import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem';

  import CurrencyText from './CurrencyText.vue';
  export default defineComponent({
    components: {
      NcAppNavigationItem,
      CurrencyText
    },
    setup() {
      return {
        settingStore: useSettingStore(),
        AccountTypeUtils
      };
    },
    props: {
      account: {
        type: Object as PropType<Account>,
        required: true
      }
    },
    computed: {
      balance() {
        if (AccountTypeUtils.isMonthlyAccount(this.account.type)) {
          const date = dayjs();
          return this.account.stats[date.year()]?.[date.month() + 1] ?? 0.0;
        } else {
          return this.account.balance;
        }
      }
    }
  });

</script>
