<template>
  <NcAppContentList class="pb-2">
    <AccountListItem
      v-for="account in accounts"
      class="mt-2 px-2"
      :key="account.id"
      :account="account"
    />
  </NcAppContentList>
</template>

<script setup lang="ts">

  import { computed, type PropType } from 'vue';

  import { useAccountStore } from '../stores/accountStore';
  import type { AccountTypeType } from '../stores/accountTypeStore';

  import NcAppContentList from '@nextcloud/vue/dist/Components/NcAppContentList';

  import AccountListItem from './AccountListItem.vue';

  const accountStore = useAccountStore();

  const props = defineProps({
    accountType: {
      type: Object as PropType<AccountTypeType>,
      required: true
    }
  });

  const accounts = computed(() => {
    return accountStore.getByType(props.accountType);
  });

</script>
