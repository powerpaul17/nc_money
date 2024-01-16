<template>
  <NcAppContent
    v-if="renderComponent"
    :show-details="showDetails"
    @update:showDetails="emit('show-details-changed', false)"
  >
    <template #list>
      <AccountList
        v-if="selectedAccount"
        :book-id="selectedAccount.bookId"
        :account-type="selectedAccount.type"
        @item-clicked="emit('show-details-changed', true)"
      />
    </template>

    <AccountDetails
      v-if="selectedAccount"
      :book-id="bookId"
      :account="selectedAccount"
    />
  </NcAppContent>
</template>

<script setup lang="ts">

  import { computed, nextTick, ref, watch } from 'vue';

  import { useAccountStore } from '../stores/accountStore';

  import NcAppContent from '@nextcloud/vue/dist/Components/NcAppContent';

  import AccountList from '../components/AccountList.vue';
  import AccountDetails from '../components/AccountDetails.vue';

  const accountStore = useAccountStore();

  const props = defineProps({
    bookId: {
      type: Number,
      required: true
    },
    accountId: {
      type: Number,
      required: true
    },
    showDetails: {
      type: Boolean,
      default: true
    }
  });

  const emit = defineEmits([ 'show-details-changed' ]);

  const renderComponent = ref(true);

  const selectedAccount = computed(() => {
    return accountStore.getById(props.accountId);
  });

  watch(selectedAccount, (newAccount, oldAccount) => {
    if (newAccount?.id !== oldAccount?.id) forceRerender();
  });

  function forceRerender(): void {
    renderComponent.value = false;
    nextTick(() => {
      renderComponent.value = true;
    });
  }

</script>
