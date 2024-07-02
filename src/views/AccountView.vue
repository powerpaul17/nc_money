<template>
  <NcAppContent
    v-if="renderComponent"
    :show-details="showDetails"
    @update:showDetails="showDetails = false"
  >
    <template #list>
      <AccountList
        v-if="selectedAccount"
        :book-id="selectedAccount.bookId"
        :account-type="selectedAccount.type"
        @account-item-clicked="navigateToAccount($event)"
        @account-type-item-clicked="navigateToAccountType()"
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
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';

  import { useAccountStore, type Account } from '../stores/accountStore';

  import NcAppContent from '@nextcloud/vue/dist/Components/NcAppContent.js';

  import AccountList from '../components/AccountList.vue';
  import AccountDetails from '../components/AccountDetails.vue';

  const router = useRouter();

  const accountStore = useAccountStore();

  const props = defineProps({
    bookId: {
      type: Number,
      required: true
    },
    accountId: {
      type: Number,
      required: true
    }
  });

  const renderComponent = ref(true);

  const selectedAccount = computed(() => {
    return accountStore.getById(props.accountId);
  });

  const showDetails = ref(true);

  async function navigateToAccount(account: Account): Promise<void> {
    showDetails.value = true;

    await router.push({
      name: 'account',
      params: {
        bookId: props.bookId,
        accountId: account.id
      }
    });
  }

  async function navigateToAccountType(): Promise<void> {
    await router.push({
      name: 'account-type',
      params: {
        bookId: props.bookId,
        accountTypeType: selectedAccount.value.type
      }
    });
  }
</script>
