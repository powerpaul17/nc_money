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

    <ul>
      <AccountListItem
        v-for="account in accounts"
        :account="account"
      ></AccountListItem>
    </ul>
  </li>
</template>

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
    }
  });
</script>