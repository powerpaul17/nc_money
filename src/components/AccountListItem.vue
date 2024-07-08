<template>
  <NcAppNavigationItem
    :class="{
      'animate-pulse rounded-full bg-[var(--color-warning)] [&>.app-navigation-entry.active]:bg-inherit':
        deleteAccountTimeout != null
    }"
    :name="
      deleteAccountTimeout != null
        ? t('money', '\'{accountName}\' deleted', { accountName: account.name })
        : account.name
    "
    :editable="deleteAccountTimeout == null"
    :edit-label="t('money', 'Rename account')"
    :edit-placeholder="t('money', 'Account name')"
    :to="{
      name: 'account',
      params: {
        bookId: account.bookId,
        accountId: account.id
      }
    }"
    :loading="isLoading"
    :undo="deleteAccountTimeout != null"
    @update:name="handleUpdateAccountName"
    @undo="handleUndo"
    @click="$emit('click')"
  >
    <template
      #counter
      v-if="deleteAccountTimeout == null"
    >
      <AccountCurrencyText
        class="mr-2"
        :value="balance"
        :animation="animationEnabled"
        :account-type="account.type"
      >
      </AccountCurrencyText>
    </template>

    <template
      #actions
      v-if="deleteAccountTimeout == null"
    >
      <NcActionButton @click="showDeleteConfirmationDialog = true">
        <template #icon>
          <Delete :size="20" />
        </template>

        {{ t('money', 'Delete account') }}
      </NcActionButton>
    </template>

    <template #extra>
      <NcModal
        v-if="showDeleteConfirmationDialog"
        @close="() => (showDeleteConfirmationDialog = false)"
        :name="t('money', 'Delete account')"
      >
        <div class="p-8">
          <div class="mb-8">
            <h2>{{ t('money', 'Are you sure?') }}</h2>
            <p>
              {{
                t('money', 'All transactions of this account will be deleted!')
              }}
            </p>
          </div>
          <div class="flex justify-evenly">
            <NcButton
              type="primary"
              @click="() => (showDeleteConfirmationDialog = false)"
            >
              <template #icon>
                <ArrowLeft />
              </template>

              {{ t('money', 'No, go back') }}
            </NcButton>
            <NcButton @click="handleDeleteAccount">
              <template #icon>
                <Delete />
              </template>

              {{ t('money', 'Yes, delete account') }}
            </NcButton>
          </div>
        </div>
      </NcModal>
    </template>
  </NcAppNavigationItem>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';

  import {
    computed,
    nextTick,
    onMounted,
    ref,
    watch,
    type PropType,
    type Ref
  } from 'vue';

  import { useRoute, useRouter } from 'vue-router';

  import { translate as t } from '@nextcloud/l10n';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import { useAccountStore, type Account } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';

  import {
    IncomeExpenseAccountsValueFormat,
    useSettingStore
  } from '../stores/settingStore';

  import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem.js';
  import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton.js';
  import NcModal from '@nextcloud/vue/dist/Components/NcModal.js';
  import NcButton from '@nextcloud/vue/dist/Components/NcButton.js';

  import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue';
  import Delete from 'vue-material-design-icons/Delete.vue';

  import AccountCurrencyText from './AccountCurrencyText.vue';

  const route = useRoute();
  const router = useRouter();

  const settingStore = useSettingStore();

  const accountStore = useAccountStore();
  const accountService = useAccountService();

  const isLoading = ref(false);
  const showDeleteConfirmationDialog = ref(false);
  const deleteAccountTimeout: Ref<null | number> = ref(null);

  const animationEnabled = ref(true);

  const props = defineProps({
    account: {
      type: Object as PropType<Account>,
      required: true
    }
  });

  onMounted(() => {
    animationEnabled.value = false;

    void nextTick(() => {
      animationEnabled.value = true;
    });
  });

  const balance = computed(() => {
    const year =
      settingStore.incomeExpenseAccountsValueFormat.value ===
      IncomeExpenseAccountsValueFormat.YEARLY
        ? dayjs().year()
        : undefined;

    if (AccountTypeUtils.isMonthlyAccount(props.account.type)) {
      return accountStore.getValue({ accountId: props.account.id, year });
    } else {
      return accountStore.getBalance({ accountId: props.account.id, year });
    }
  });

  async function handleUpdateAccountName(accountName: string): Promise<void> {
    props.account.name = accountName;

    isLoading.value = true;
    await accountService.updateAccount(props.account);
    isLoading.value = false;
  }

  function handleDeleteAccount(): void {
    showDeleteConfirmationDialog.value = false;

    if (deleteAccountTimeout.value != null) return;

    deleteAccountTimeout.value = window.setTimeout(() => {
      if (Number(route.params.accountId) === props.account.id)
        void router.push('/');

      void accountService.deleteAccount(props.account.id);
    }, 10000);
  }

  function handleUndo(): void {
    if (deleteAccountTimeout.value != null) {
      window.clearTimeout(deleteAccountTimeout.value);
      deleteAccountTimeout.value = null;
    }
  }
</script>
