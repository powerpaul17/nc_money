<template>
  <NcAppNavigationItem
    :title="accountType.name"
    :allow-collapse="collapsible"
    :open.sync="isOpen"
    icon="icon-folder"
    :class="{ 'mb-5': collapsible && isOpen }"
  >
    <template #counter>
      <CurrencyText
        class="mr-2"
        :value="balance"
        :animation="true"
        :inverted-value="settingStore.useInvertedAccounts && AccountTypeUtils.isInvertedAccount(accountType.type)"
      >
        <template
          #suffix
          v-if="AccountTypeUtils.isMonthlyAccount(accountType.type)"
        >
          / {{ t('money', 'mo') }}
        </template>
      </CurrencyText>
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

    <template #default>
      <AccountListItem
        v-for="account in accounts"
        :key="account.id"
        :account="account"
      />
    </template>
  </NcAppNavigationItem>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';

  import { computed, ref, type PropType } from 'vue';

  import { useRouter } from 'vue-router';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import { useAccountStore } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';
  import type {
    AccountType
  } from '../stores/accountTypeStore';

  import { useSettingStore } from '../stores/settingStore';

  import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton';
  import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem';

  import Plus from 'vue-material-design-icons/Plus.vue';

  import AccountListItem from './AccountListItem.vue';
  import CurrencyText from './CurrencyText.vue';

  const props = defineProps({
    accountType: {
      type: Object as PropType<AccountType>,
      required: true
    }
  });

  const router = useRouter();

  const accountStore = useAccountStore();
  const accountService = useAccountService();

  const settingStore = useSettingStore();

  const isOpen = ref(true);

  const balance = computed(() => {
    if (AccountTypeUtils.isMonthlyAccount(props.accountType.type)) {
      const date = dayjs();
      return accountStore.getSummaryByType(
        props.accountType.type,
        date.year(),
        date.month() + 1
      );
    } else {
      return props.accountType.balance;
    }
  });

  const accounts = computed(() => {
    return accountStore.getByType(props.accountType.type);
  });

  const collapsible = computed(() => {
    return !!accounts.value.length;
  });

  async function handleAddAccountClick(): Promise<void> {
    const newAccount = await accountService.addAccount({
      name: 'New Account',
      description: '',
      currency: '',
      type: props.accountType.type
    });

    router.push(`/account/${newAccount.id}`);

    isOpen.value = true;
  }
</script>
