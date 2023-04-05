<template>
  <NcSelect
    :options="accounts"
    label="name"
    v-model="selectedAccount"
    :disabled="!editable"
    :no-wrap="true"
    :append-to-body="true"
    :filter-by="
      (option, label, search) => {
        return [ label, option.description ].join(' ').toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >= 0;
      }
    "
  >
    <template #option="account">
      <div class="overflow-hidden text-ellipsis whitespace-nowrap">{{ account.name }}</div>
      <div class="overflow-hidden text-ellipsis whitespace-nowrap text-xs">
        <span class="uppercase">{{ AccountTypeUtils.getAbbreviationOfAccountType(account.type) }}</span> {{ account.description ? `· ${account.description}` : '' }}
      </div>
    </template>

    <template #selected-option="account" class="w-full">
      <div class="overflow-hidden text-ellipsis whitespace-nowrap ">
        {{ account.name }} · <span class="text-xs uppercase">{{ AccountTypeUtils.getAbbreviationOfAccountType(account.type) }}</span>
      </div>
    </template>
  </NcSelect>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import {useAccountStore, type Account} from '../stores/accountStore';
  import type {AccountTypeType} from '../stores/accountTypeStore';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import NcSelect from '@nextcloud/vue/dist/Components/NcSelect';

  const  accountStore = useAccountStore();

  const props = withDefaults(
    defineProps<{
      accountId?: number|null;
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
      const selectedAccount = accounts.value.find((a) => a.id === props.accountId);
      return selectedAccount ?? null;
    },
    set(newSelectedAccount) {
      emit('account-changed', newSelectedAccount?.id);
    }
  });

  const accounts = computed((): Array<Account> => {
    return accountStore.accounts.filter(
      (a) => !props.excludedAccountIds?.includes(a.id)
    );
  });

</script>
