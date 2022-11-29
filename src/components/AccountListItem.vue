<template>
  <NcAppNavigationItem
    :title="account.name"
    :editable="true"
    :edit-label="t('money', 'Rename account')"
    :edit-placeholder="t('money', 'Account name')"
    :to="`/account/${account.id}`"
    :loading="isLoading"
    @update:title="handleUpdateAccountName"
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

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import type { Account } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';

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
        accountService: useAccountService(),
        AccountTypeUtils
      };
    },
    data() {
      return {
        isLoading: false
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
    },
    methods: {
      async handleUpdateAccountName(accountName: string): Promise<void> {
        this.account.name = accountName;

        this.isLoading = true;
        await this.accountService.updateAccount(this.account);
        this.isLoading = false;
      }
    }
  });

</script>
