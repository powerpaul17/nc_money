<template>
  <li
    class="collapsible"
    :class="{ 'open mb-5': isOpen }"
  >
    <a
      class="icon-folder"
      @click.stop="isOpen = !isOpen"
    >
      <div class="flex h-full w-full">
        <div class="flex-auto overflow-hidden text-ellipsis">{{ name }}</div>
        <div class="grow text-right">
          <CurrencyText
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
        </div>
      </div>
    </a>

    <div class="app-navigation-entry-utils">
      <ul>
        <li class="app-navigation-entry-utils-menu-button">
          <button @click="isMenuOpen = !isMenuOpen" />
        </li>
      </ul>
    </div>
    <div
      class="app-navigation-entry-menu"
      :class="{ open: isMenuOpen }"
    >
      <ul>
        <li>
          <a @click="handleAddAccountClick">
            <span class="icon-add" />
            <span>{{ t('money', 'Add account') }}</span>
          </a>
        </li>
      </ul>
    </div>

    <ul>
      <AccountListItem
        v-for="account in accounts"
        :key="account.id"
        :account="account"
      />
      <li v-if="!accounts.length">
        <a href="#">
          {{ t('money', 'No accounts') }}
        </a>
      </li>
    </ul>
  </li>
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
  const isMenuOpen = ref(false);

  const name = computed(() => {
    return props.accountType.name;
  });

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

  async function handleAddAccountClick(): Promise<void> {
    const newAccount = await accountService.addAccount({
      name: 'New Account',
      description: '',
      currency: '',
      type: props.accountType.type
    });

    router.push(`/account/${newAccount.id}`);

    isOpen.value = true;
    isMenuOpen.value = false;
  }
</script>
