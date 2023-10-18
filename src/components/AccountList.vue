<template>
  <NcAppContentList class="pb-2">
    <NcAppNavigationItem
      class="mt-2 mb-6 px-2"
      :name="`${accountTypeName} - ${t('money', 'Overview')}`"
      :to="`/accountType/${accountType}`"
      @click="emit('item-clicked')"
    />

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

  import { computed, ref, type PropType } from 'vue';

  import { useAccountStore } from '../stores/accountStore';
  import type { AccountTypeType } from '../stores/accountTypeStore';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import NcAppContentList from '@nextcloud/vue/dist/Components/NcAppContentList';
  import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem';

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

  const sortMode = ref(SortMode.BY_NAME);
  const sortDirection = ref(false);

  const accounts = computed(() => {
    const acc = accountStore.getByType(props.accountType).value
      .sort((a1, a2) => {
        switch (sortMode.value) {
          default:
          case SortMode.BY_NAME:
            return a1.name.localeCompare(a2.name);

          case SortMode.BY_VALUE:
            if (AccountTypeUtils.isMonthlyAccount(props.accountType)) {
              return accountStore.getSummary(a1.id) - accountStore.getSummary(a2.id);
            }

            return accountStore.getBalance(a1.id) - accountStore.getBalance(a2.id);
        }
      });

    if (sortDirection.value) {
      return acc.reverse();
    }

    return acc;
  });

  const accountTypeName = computed(() => {
    return AccountTypeUtils.getNameOfAccountType(props.accountType, true);
  });

  enum SortMode {
    BY_NAME = 'by_name',
    BY_VALUE = 'by_value'
  }

</script>
