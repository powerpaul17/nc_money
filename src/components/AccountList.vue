<template>
  <NcAppContentList class="pb-2">
    <NcAppNavigationItem
      class="mt-2 px-2"
      :name="`${accountTypeName} - ${t('money', 'Overview')}`"
      :to="`/accountType/${accountType}`"
      @click="emit('item-clicked')"
    />

    <NcAppNavigationSpacer class="order-none" />

    <AccountListItem
      v-for="account in accounts"
      class="mt-2 px-2"
      :key="account.id"
      :account="account"
      @click="emit('item-clicked')"
    />
  </NcAppContentList>
</template>

<script setup lang="ts">

  import { computed, type PropType } from 'vue';

  import { useAccountStore } from '../stores/accountStore';
  import type { AccountTypeType } from '../stores/accountTypeStore';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import NcAppContentList from '@nextcloud/vue/dist/Components/NcAppContentList';
  import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem';
  import NcAppNavigationSpacer from '@nextcloud/vue/dist/Components/NcAppNavigationSpacer';

  import AccountListItem from './AccountListItem.vue';

  const accountStore = useAccountStore();

  const props = defineProps({
    accountType: {
      type: Number as PropType<AccountTypeType>,
      required: true
    }
  });

  const emit = defineEmits([
    'item-clicked'
  ]);

  const accounts = accountStore.getByType(props.accountType);

  const accountTypeName = computed(() => {
    return AccountTypeUtils.getNameOfAccountType(props.accountType, true);
  });

</script>
