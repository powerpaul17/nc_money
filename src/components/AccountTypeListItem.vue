<template>
  <NcAppNavigationItem
    :name="accountType.name"
    :to="{
      name: 'account-type',
      params: {
        bookId: bookId,
        accountTypeType: accountType.type
      }
    }"
    :exact="true"
    :allow-collapse="false"
    icon="icon-folder"
  >
    <template #counter>
      <AccountCurrencyText
        class="mr-2"
        :value="balance"
        :account-type="accountType.type"
      >
      </AccountCurrencyText>
    </template>

    <template #actions>
      <NcActionButton
        @click="handleAddAccountClick"
        :close-after-click="true"
      >
        <template #icon>
          <Plus />
        </template>

        <template #default>
          <span>
            {{ t('money', 'Add account') }}
          </span>
        </template>
      </NcActionButton>
    </template>
  </NcAppNavigationItem>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';

  import { type PropType, computed } from 'vue';
  import { useRouter } from 'vue-router';

  import { translate as t } from '@nextcloud/l10n';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import { useAccountStore } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';
  import type { AccountType } from '../stores/accountTypeStore';

  import {
    IncomeExpenseAccountsValueFormat,
    useSettingStore
  } from '../stores/settingStore';

  import { NcAppNavigationItem, NcActionButton } from '@nextcloud/vue';

  import Plus from 'vue-material-design-icons/Plus.vue';

  import AccountCurrencyText from './AccountCurrencyText.vue';

  const router = useRouter();

  const accountStore = useAccountStore();
  const accountService = useAccountService();

  const settingStore = useSettingStore();

  const props = defineProps({
    bookId: {
      type: Number,
      required: true
    },
    accountType: {
      type: Object as PropType<AccountType>,
      required: true
    }
  });

  const balance = computed(() => {
    const date = dayjs();
    const month =
      settingStore.incomeExpenseAccountsValueFormat.value ===
      IncomeExpenseAccountsValueFormat.YEARLY
        ? undefined
        : date.month() + 1;

    if (AccountTypeUtils.isMonthlyAccount(props.accountType.type)) {
      return accountStore.getSummaryByType({
        bookId: props.bookId,
        accountType: props.accountType.type,
        year: date.year(),
        month
      }).value;
    } else {
      return accountStore.getBalanceByType({
        bookId: props.bookId,
        accountType: props.accountType.type,
        year: date.year(),
        month
      }).value;
    }
  });

  async function handleAddAccountClick(): Promise<void> {
    const newAccount = await accountService.addAccount({
      name: t('money', 'New Account'),
      bookId: props.bookId,
      description: '',
      currency: '',
      type: props.accountType.type,
      extraData: {}
    });

    await router.push({
      name: 'account',
      params: {
        bookId: props.bookId,
        accountId: newAccount.id
      }
    });
  }
</script>
