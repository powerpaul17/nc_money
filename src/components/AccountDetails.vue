<template>
  <div class="mx-auto flex h-[calc(100vh-50px)] flex-col lg:container">
    <AccountDetailsHeader
      :account="account"
      :show-shadow="showShadow"
    />
    <TransactionList
      :book-id="bookId"
      :account="account"
      @scroll-state-changed="($event) => (showShadow = !$event)"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, type PropType } from 'vue';

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

  const showShadow = ref(false);
</script>
