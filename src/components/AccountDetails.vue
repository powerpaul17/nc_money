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
    <TransactionList
      :book-id="bookId"
      :account="account"
    />
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue';

  import type { Account } from '../stores/accountStore';

  import AccountDetailsHeader from './AccountDetailsHeader.vue';
  import TransactionList from './TransactionList.vue';

  defineProps({
    bookId: {
      type: Number,
      required: true
    },
    account: {
      type: Object as PropType<Account>,
      required: true
    }
  });

</script>
