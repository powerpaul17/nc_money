<template>
  <div
    class="
      mx-auto
      flex
      h-[calc(100vh-50px)]
      flex-col
      lg:container
    "
  >
    <AccountDetailsHeader :account="account" />
    <TransactionList :account="account" />
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue';

  import type { Account } from '../stores/accountStore';

  import AccountDetailsHeader from './AccountDetailsHeader.vue';
  import TransactionList from './TransactionList.vue';

  defineProps({
    account: {
      type: Object as PropType<Account>,
      required: true
    }
  });

</script>
