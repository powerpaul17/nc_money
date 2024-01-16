<template>
  <NcAppContentList class="pb-2">
    <NcAppNavigationItem
      class="mb-6 mt-2 px-2"
      :name="`${accountTypeName} - ${t('money', 'Overview')}`"
      :to="`/accountType/${accountType}`"
      @click="emit('item-clicked')"
    />

    <div class="flex items-center justify-end gap-1 px-2">
      <NcInputField
        :value.sync="filterString"
        :placeholder="t('money', 'Filter list') + '...'"
      />

      <NcButton
        :type="sortMode === SortMode.BY_NAME ? 'secondary' : 'tertiary'"
        @click="clickOnSortMode(SortMode.BY_NAME)"
      >
        <template #icon>
          <SortAlphabeticalDescending
            v-if="sortMode === SortMode.BY_NAME && sortDirection"
            :size="20"
          />
          <SortAlphabeticalAscending
            v-else
            :size="20"
          />
        </template>
      </NcButton>

      <NcButton
        :type="sortMode === SortMode.BY_VALUE ? 'secondary' : 'tertiary'"
        @click="clickOnSortMode(SortMode.BY_VALUE)"
      >
        <template #icon>
          <SortNumericDescending
            v-if="sortMode === SortMode.BY_VALUE && sortDirection"
            :size="20"
          />
          <SortNumericAscending
            v-else
            :size="20"
          />
        </template>
      </NcButton>
    </div>

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

  import { computed, ref, type PropType, watch } from 'vue';

  import { useAccountStore } from '../stores/accountStore';
  import type { AccountTypeType } from '../stores/accountTypeStore';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import NcAppContentList from '@nextcloud/vue/dist/Components/NcAppContentList';
  import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem';
  import NcInputField from '@nextcloud/vue/dist/Components/NcInputField';
  import NcButton from '@nextcloud/vue/dist/Components/NcButton';

  import SortAlphabeticalAscending from 'vue-material-design-icons/SortAlphabeticalAscending.vue';
  import SortAlphabeticalDescending from 'vue-material-design-icons/SortAlphabeticalDescending.vue';

  import SortNumericAscending from 'vue-material-design-icons/SortNumericAscending.vue';
  import SortNumericDescending from 'vue-material-design-icons/SortNumericDescending.vue';

  import AccountListItem from './AccountListItem.vue';

  const accountStore = useAccountStore();

  const props = defineProps({
    bookId: {
      type: Number,
      required: true
    },
    accountType: {
      type: Number as PropType<AccountTypeType>,
      required: true
    }
  });

  const emit = defineEmits([
    'item-clicked'
  ]);

  const filterString = ref('');

  watch(() => props.accountType, () => {
    filterString.value = '';
  });

  const sortMode = ref(loadSortMode());
  const sortDirection = ref(loadSortDirection());

  const accounts = computed(() => {
    const acc = accountStore
      .getByType({ bookId: props.bookId, accountType: props.accountType })
      .value.filter((a) => {
        if (filterString.value.length <= 1) return true;
        return [ a.name, a.description ].join(' ').toLocaleLowerCase().includes(filterString.value.toLocaleLowerCase());
      })
      .sort((a1, a2) => {
        switch (sortMode.value) {
          default:
          case SortMode.BY_NAME:
            return a1.name.localeCompare(a2.name);

          case SortMode.BY_VALUE:
            if (AccountTypeUtils.isMonthlyAccount(props.accountType)) {
              return (
                accountStore.getSummary({ accountId: a1.id }) -
                accountStore.getSummary({ accountId: a2.id })
              );
            }

            return (
              accountStore.getBalance({ accountId: a1.id }) -
              accountStore.getBalance({ accountId: a2.id })
            );
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

  function clickOnSortMode(newSortMode: SortMode): void {
    if (sortMode.value === newSortMode) {
      sortDirection.value = !sortDirection.value;
    } else {
      sortMode.value = newSortMode;
      sortDirection.value = false;
    }

    saveSortingSettings(sortMode.value, sortDirection.value);
  }

  function loadSortMode(): SortMode {
    const savedSortMode = localStorage.getItem('money.accountListSortMode');
    if (savedSortMode === SortMode.BY_VALUE) return SortMode.BY_VALUE;
    else return SortMode.BY_NAME;
  }

  function loadSortDirection():boolean {
    return localStorage.getItem('money.accountListSortDirection') === 'true';
  }

  function saveSortingSettings(sortMode: SortMode, sortDirection: boolean): void {
    localStorage.setItem('money.accountListSortMode', sortMode);
    localStorage.setItem('money.accountListSortDirection', sortDirection.toString());
  }

  enum SortMode {
    BY_NAME = 'by_name',
    BY_VALUE = 'by_value'
  }

</script>
