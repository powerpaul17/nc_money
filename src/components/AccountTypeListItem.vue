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

<script lang="ts">
  import dayjs from 'dayjs';

  import { defineComponent, type PropType } from 'vue';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import { useAccountStore } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';
  import type { AccountType } from '../stores/accountTypeStore';

  import { useSettingStore } from '../stores/settingStore';

  import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem';
  import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton';

  import Plus from 'vue-material-design-icons/Plus.vue';

  import AccountListItem from './AccountListItem.vue';
  import CurrencyText from './CurrencyText.vue';

  export default defineComponent({
    components: {
      NcAppNavigationItem,
      CurrencyText,
      NcActionButton,
      Plus,
      AccountListItem
    },
    props: {
      accountType: {
        type: Object as PropType<AccountType>,
        required: true
      }
    },
    data() {
      return {
        accountStore: useAccountStore(),
        accountService: useAccountService(),

        settingStore: useSettingStore(),

        balance: 0.0,

        isOpen: true,

        AccountTypeUtils
      };
    },
    watch: {
      accountType: {
        handler() {
          if (AccountTypeUtils.isMonthlyAccount(this.accountType.type)) {
            const date = dayjs();
            this.balance = this.accountStore.getSummaryByType(
              this.accountType.type,
              date.year(),
              date.month() + 1
            );
          } else {
            this.balance = this.accountType.balance;
          }
        },
        deep: true
      }
    },
    computed: {
      accounts() {
        return this.accountStore.getByType(this.accountType.type);
      },
      collapsible() {
        return !!this.accounts.length;
      }
    },
    methods: {
      async handleAddAccountClick(): Promise<void> {
        const newAccount = await this.accountService.addAccount({
          name: this.t('money', 'New Account'),
          description: '',
          currency: '',
          type: this.accountType.type
        });

        this.$router.push(`/account/${newAccount.id}`);

        this.isOpen = true;
      }
    }
  });
</script>
