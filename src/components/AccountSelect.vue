<template>
  <VueSelect
    class="account-select w-full min-w-0"
    :options="accounts"
    label="name"
    v-model="selectedAccount"
    :disabled="!editable"
    :append-to-body="true"
    :filter-by="
      (option, label, search) => {
        return (
          [label, option.description]
            .join(' ')
            .toLocaleLowerCase()
            .indexOf(search.toLocaleLowerCase()) >= 0
        );
      }
    "
    :placeholder="`-- ${t('money', 'No Account')} --`"
  >
    <template #option="account">
      <div class="truncate">
        {{ account.name }}
      </div>
      <div class="truncate text-xs">
        <span class="uppercase">{{
          AccountTypeUtils.getAbbreviationOfAccountType(account.type)
        }}</span>
        {{ account.description ? `· ${account.description}` : '' }}
      </div>
    </template>

    <template #selected-option="account">
      <div class="truncate">
        {{ account.name }} ·
        <span class="text-xs uppercase">{{
          AccountTypeUtils.getAbbreviationOfAccountType(account.type)
        }}</span>
      </div>
    </template>

    <template #no-options="{ search }">
      <div class="truncate">
        {{
          search
            ? t('money', 'No account found')
            : t('money', 'No account available')
        }}...
      </div>
    </template>
  </VueSelect>
</template>

<style>
  .vs__dropdown-menu {
    --vs-border-width: 2px;
    --vs-border-radius: var(--border-radius-large);
  }

  .vs__dropdown-menu {
    --vs-border-color: var(--color-primary-element);
  }

  .account-select {
    --vs-dropdown-bg: var(--color-main-background);

    --vs-dropdown-option--active-bg: var(--color-background-hover);
    --vs-dropdown-option--active-color: var(--color-main-text);

    --vs-search-input-bg: transparent;

    --vs-selected-color: var(--color-main-text);

    --vs-border-color: transparent;
    --vs-border-width: 2px;
    --vs-border-radius: var(--border-radius-large);

    --vs-dropdown-color: var(--color-main-text);

    --vs-disabled-bg: transparent;
  }

  .account-select.vs--open {
    --vs-search-input-bg: var(--color-main-background);
  }

  .account-select:hover:not(.vs--disabled),
  .account-select:focus-within {
    --vs-border-color: var(--color-primary-element);
  }

  .account-select .vs__selected-options {
    overflow: hidden;
    flex-wrap: nowrap;
  }

  .account-select .vs__selected {
    overflow: hidden;
    margin: 0;
  }

  .account-select.vs--open .vs__selected {
    position: unset;
  }

  .account-select .vs__dropdown-toggle {
    padding: 0;
  }

  .account-select .vs__search {
    margin: 0;
  }
</style>

<script setup lang="ts">
  import { computed } from 'vue';

  import { translate as t } from '@nextcloud/l10n';

  import { useAccountStore, type Account } from '../stores/accountStore';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import VueSelect from 'vue-select';

  const accountStore = useAccountStore();

  const props = withDefaults(
    defineProps<{
      bookId: number;
      accountId?: number | null;
      editable?: boolean;
      excludedAccountIds?: Array<number>;
    }>(),
    {
      accountId: null,
      editable: true,
      excludedAccountIds: () => []
    }
  );

  const emit = defineEmits(['account-changed']);

  const selectedAccount = computed({
    get() {
      const selectedAccount = accounts.value.find(
        (a) => a.id === props.accountId
      );
      return selectedAccount ?? null;
    },
    set(newSelectedAccount) {
      emit('account-changed', newSelectedAccount?.id);
    }
  });

  const accounts = computed((): Array<Account> => {
    return accountStore
      .getByBookId(props.bookId)
      .filter((a) => !props.excludedAccountIds?.includes(a.id))
      .sort((a1, a2) => {
        if (a1.type === a2.type) {
          return a1.name.localeCompare(a2.name);
        }

        return a1.type - a2.type;
      });
  });
</script>
