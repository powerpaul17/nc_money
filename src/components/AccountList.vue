<template>
  <NcAppContentList class="pb-2 h-full">
    <NcAppNavigationItem
      class="mb-6 mt-2 px-2"
      :name="`${accountTypeName} - ${t('money', 'Overview')}`"
      :to="{
        name: 'account-type',
        params: {
          bookId: bookId,
          accountTypeType: accountType
        }
      }"
      @click="emit('account-type-item-clicked', accountType)"
    />

    <div class="flex items-center justify-end gap-1 px-2">
      <NcInputField
        v-model="filterString"
        :placeholder="t('money', 'Filter list') + '...'"
      />

      <NcButton
        :variant="sortMode === SortMode.BY_NAME ? 'secondary' : 'tertiary'"
        @click="clickOnSortMode(SortMode.BY_NAME)"
      >
        <template #icon>
          <NcIconSvgWrapper
            v-if="sortMode === SortMode.BY_NAME && sortDirection"
            :path="mdiSortAlphabeticalDescending"
            :size="20"
          />
          <NcIconSvgWrapper
            v-else
            :path="mdiSortAlphabeticalAscending"
            :size="20"
          />
        </template>
      </NcButton>

      <NcButton
        :variant="sortMode === SortMode.BY_VALUE ? 'secondary' : 'tertiary'"
        @click="clickOnSortMode(SortMode.BY_VALUE)"
      >
        <template #icon>
          <NcIconSvgWrapper
            v-if="sortMode === SortMode.BY_VALUE && sortDirection"
            :path="mdiSortNumericDescending"
            :size="20"
          />
          <NcIconSvgWrapper
            v-else
            :path="mdiSortNumericAscending"
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
      @click="emit('account-item-clicked', account)"
    />
  </NcAppContentList>
</template>

<script setup lang="ts">
  import { computed, ref, type PropType, watch } from 'vue';

  import { translate as t } from '@nextcloud/l10n';

  import { useAccountStore, type Account } from '../stores/accountStore';
  import type { AccountTypeType } from '../stores/accountTypeStore';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import {
    NcAppContentList,
    NcAppNavigationItem,
    NcInputField,
    NcButton,
    NcIconSvgWrapper
  } from '@nextcloud/vue';

  import {
    mdiSortAlphabeticalAscending,
    mdiSortAlphabeticalDescending,
    mdiSortNumericAscending,
    mdiSortNumericDescending
  } from '@mdi/js';

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

  const emit = defineEmits<{
    (event: 'account-type-item-clicked', accountType: AccountTypeType): void;
    (event: 'account-item-clicked', account: Account): void;
  }>();

  const filterString = ref('');

  watch(
    () => props.accountType,
    () => {
      filterString.value = '';
    }
  );

  const sortMode = ref(loadSortMode());
  const sortDirection = ref(loadSortDirection());

  const accounts = computed(() => {
    const acc = accountStore
      .getByType({ bookId: props.bookId, accountType: props.accountType })
      .value.filter((a) => {
        if (filterString.value.length <= 1) return true;
        return [a.name, a.description]
          .join(' ')
          .toLocaleLowerCase()
          .includes(filterString.value.toLocaleLowerCase());
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

  function loadSortDirection(): boolean {
    return localStorage.getItem('money.accountListSortDirection') === 'true';
  }

  function saveSortingSettings(
    sortMode: SortMode,
    sortDirection: boolean
  ): void {
    localStorage.setItem('money.accountListSortMode', sortMode);
    localStorage.setItem(
      'money.accountListSortDirection',
      sortDirection.toString()
    );
  }

  enum SortMode {
    BY_NAME = 'by_name',
    BY_VALUE = 'by_value'
  }
</script>
