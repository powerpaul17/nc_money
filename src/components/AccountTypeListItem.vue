<template>
  <NcAppNavigationItem
    :title="accountType.name"
    :to="`/accountType/${accountType.type}`"
    :exact="true"
    :allow-collapse="false"
    icon="icon-folder"
    @click="$emit('show-details-changed', false)"
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
  </NcAppNavigationItem>
</template>

<script setup lang="ts">

  import dayjs from 'dayjs';

  import { ref, watch, type PropType } from 'vue';
  import { useRouter } from 'vue2-helpers/vue-router';

  import { translate as t } from '@nextcloud/l10n';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import { useAccountStore } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';
  import type { AccountType } from '../stores/accountTypeStore';

  import { useSettingStore } from '../stores/settingStore';

  import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem';
  import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton';

  import Plus from 'vue-material-design-icons/Plus.vue';

  import CurrencyText from './CurrencyText.vue';

  const router = useRouter();

  const accountStore = useAccountStore();
  const accountService = useAccountService();

  const settingStore = useSettingStore();

  const props = defineProps({
    accountType: {
      type: Object as PropType<AccountType>,
      required: true
    }
  });

  const balance = ref(getAccountTypeBalance());

  watch(() => props.accountType, () => {
    balance.value = getAccountTypeBalance();
  }, {
    deep: true
  });

  function getAccountTypeBalance(): number {
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
  }

  async function handleAddAccountClick(): Promise<void> {
    const newAccount = await accountService.addAccount({
      name: t('money', 'New Account'),
      description: '',
      currency: '',
      type: props.accountType.type
    });

    await router.push(`/account/${newAccount.id}`);
  }

</script>
