<template>
  <AccountDetailsHeader
    :account="account"
  ></AccountDetailsHeader>
  <TransactionList :account="account"></TransactionList>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import type { Account } from '../stores/accountStore';

  import AccountDetailsHeader from './AccountDetailsHeader.vue';
  import TransactionList from './TransactionList.vue';

  export default defineComponent({
    props: {
      account: {
        type: Object as PropType<Account>,
        required: true
      }
    },
    components: {
      AccountDetailsHeader,
      TransactionList
    }
  });
</script>
