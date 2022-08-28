<template>
  <li class="collapsible" :class="{ 'open mb-5': isOpen }">
    <a class="icon-folder" @click.stop="isOpen = !isOpen">
      <div class="flex w-full h-full">
        <div class="flex-auto overflow-hidden text-ellipsis">{{ name }}</div>
        <div class="flex-grow text-right">
          <CurrencyText :value="balance" :animation="true"></CurrencyText>
        </div>
      </div>
    </a>

    <div class="app-navigation-entry-utils">
      <ul>
        <li class="app-navigation-entry-utils-menu-button">
          <button @click="isMenuOpen = !isMenuOpen"></button>
        </li>
      </ul>
    </div>
    <div class="app-navigation-entry-menu" :class="{ open: isMenuOpen }">
      <ul>
        <li>
          <a @click="handleAddAccountClick">
            <span class="icon-add"></span>
            <span>{{ $t('addAccount') }}</span>
          </a>
        </li>
      </ul>
    </div>

    <ul>
      <AccountListItem
        v-for="account in accounts"
        :account="account"
      ></AccountListItem>
    </ul>
  </li>
</template>

<i18n>
{
  "en": {
    "addAccount": "Add account"
  }
}
</i18n>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import { AccountType, useAccountStore } from '../stores/accountStore';

  import AccountListItem from './AccountListItem.vue';
  import type { AccountType as AccountTypeEntity } from './AccountTypesList.vue';
  import CurrencyText from './CurrencyText.vue';

  export default defineComponent({
    components: {
      AccountListItem,
      CurrencyText
    },
    props: {
      accountType: {
        type: Object as PropType<AccountTypeEntity>,
        required: true
      }
    },
    data() {
      return {
        accountStore: useAccountStore(),
        isOpen: false,
        isMenuOpen: false,
        AccountType
      };
    },
    computed: {
      name: function () {
        return this.accountType.name;
      },
      balance: function () {
        return this.accountType.balance;
      },
      accounts: function () {
        return this.accountStore.getByType(this.accountType.id);
      }
    },
    methods: {
      async handleAddAccountClick() {
        const newAccount = await this.accountStore.addAccount({
          name: 'New Account',
          description: '',
          currency: '',
          type: this.accountType.id
        });

        this.$router.push(`/accounts/${newAccount.id}`);

        this.isOpen = true;
        this.isMenuOpen = false;
      }
    }
  });
</script>
