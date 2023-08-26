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
    emits: [ 'show-details-changed' ],
    data() {
      return {
        balance: this.getAccountTypeBalance()
      };
    },
    watch: {
      accountType: {
        handler() {
          this.balance = this.getAccountTypeBalance();
        },
        deep: true
      }
    },
    computed: {
      accounts() {
        return this.accountStore.getByType(this.accountType.type);
      }
    },
    methods: {
      getAccountTypeBalance() {
        if (AccountTypeUtils.isMonthlyAccount(this.accountType.type)) {
          const date = dayjs();
          return this.accountStore.getSummaryByType(
            this.accountType.type,
            date.year(),
            date.month() + 1
          );
        } else {
          return this.accountType.balance;
        }
      },
      async handleAddAccountClick(): Promise<void> {
        const newAccount = await this.accountService.addAccount({
          name: this.t('money', 'New Account'),
          description: '',
          currency: '',
          type: this.accountType.type
        });

        await this.$router.push(`/account/${newAccount.id}`);
      }
    },
    setup() {
      return {
        accountStore: useAccountStore(),
        accountService: useAccountService(),

        settingStore: useSettingStore(),

        AccountTypeUtils
      };
    }
  });
</script>
