<template>
  <NcAppNavigationItem
    :class="{
      'bg-[var(--color-warning)] animate-pulse rounded-full [&>.app-navigation-entry.active]:bg-inherit': deleteAccountTimeout
    }"
    :title="
      deleteAccountTimeout ?
        t('money', '\'{accountName}\' deleted', { accountName: account.name }) :
        account.name
    "
    :editable="!deleteAccountTimeout"
    :edit-label="t('money', 'Rename account')"
    :edit-placeholder="t('money', 'Account name')"
    :to="`/account/${account.id}`"
    :loading="isLoading"
    :undo="deleteAccountTimeout"
    @update:title="handleUpdateAccountName"
    @undo="handleUndo"
  >
    <template
      #counter
      v-if="!deleteAccountTimeout"
    >
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

    <template
      #actions
      v-if="!deleteAccountTimeout"
    >
      <NcActionButton @click="(showDeleteConfirmationDialog = true)">
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
        :title="t('money', 'Delete account')"
      >
        <div class="p-8">
          <div class="mb-8">
            <h2>{{ t('money', 'Are you sure?') }}</h2>
            <p>{{ t('money', 'All transactions of this account will be deleted!') }}</p>
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

<script lang="ts">
  import dayjs from 'dayjs';

  import { defineComponent, type PropType } from 'vue';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import type { Account } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';

  import { useSettingStore } from '../stores/settingStore';

  import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem';
  import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton';
  import NcModal from '@nextcloud/vue/dist/Components/NcModal';
  import NcButton from '@nextcloud/vue/dist/Components/NcButton';

  import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue';
  import Delete from 'vue-material-design-icons/Delete.vue';

  import CurrencyText from './CurrencyText.vue';
  export default defineComponent({
    components: {
      NcAppNavigationItem,
      CurrencyText,
      NcActionButton,
      ArrowLeft,
      Delete,
      NcModal,
      NcButton
    },
    setup() {
      return {
        settingStore: useSettingStore(),
        accountService: useAccountService(),
        AccountTypeUtils
      };
    },
    data(): {
      isLoading: boolean;
      showDeleteConfirmationDialog: boolean;
      deleteAccountTimeout: number|null;
    } {
      return {
        isLoading: false,
        showDeleteConfirmationDialog: false,
        deleteAccountTimeout: null
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
      },
      handleDeleteAccount(): void {
        this.showDeleteConfirmationDialog = false;

        if (this.deleteAccountTimeout) return;

        this.deleteAccountTimeout = window.setTimeout(() => {
          if (Number(this.$route.params.accountId) === this.account.id)
            this.$router.push('/');

          this.accountService.deleteAccount(this.account.id);
        }, 10000);
      },
      handleUndo(): void {
        if (this.deleteAccountTimeout) {
          window.clearTimeout(this.deleteAccountTimeout);
          this.deleteAccountTimeout = null;
        }
      }
    }
  });

</script>
