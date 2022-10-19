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

<script lang="ts">
  import dayjs from 'dayjs';

  import { defineComponent, type PropType } from 'vue';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import { useAccountStore } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';
  import type {
    AccountType
  } from '../stores/accountTypeStore';

  import AccountListItem from './AccountListItem.vue';
  import CurrencyText from './CurrencyText.vue';

  export default defineComponent({
    components: {
      AccountListItem,
      CurrencyText
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
        AccountTypeUtils,
        isOpen: true,
        isMenuOpen: false
      };
    },
    computed: {
      name() {
        return this.accountType.name;
      },
      balance() {
        if(AccountTypeUtils.isMonthlyAccount(this.accountType.type)) {
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
      accounts() {
        return this.accountStore.getByType(this.accountType.type);
      }
    },
    methods: {
      async handleAddAccountClick() {
        const newAccount = await this.accountService.addAccount({
          name: 'New Account',
          description: '',
          currency: '',
          type: this.accountType.type
        });

        this.$router.push(`/account/${newAccount.id}`);

        this.isOpen = true;
        this.isMenuOpen = false;
      }
    }
  });
</script>
