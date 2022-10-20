<template>
  <select
    :disabled="!editable"
    v-model="selectedAccountId"
    @change="handleSelectChange"
  >
    <option :value="null">
      -- No Account --
    </option>
    <option
      v-for="account in accounts"
      :key="account.id"
      :value="account.id"
    >
      {{ account.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
  import { computed, ref, watch, type PropType } from 'vue';

  import { useAccountStore, type Account } from '../stores/accountStore';

  const  accountStore = useAccountStore();

  const props = defineProps({
    accountId: {
      type: Number,
      default: null
    },
    editable: {
      type: Boolean,
      default: true
    },
    excludedAccountIds: {
      type: Array as PropType<Array<number>>,
      default: () => []
    }
  });

  const emit = defineEmits([ 'account-changed' ]);

  const selectedAccountId = ref(props.accountId);

  const accounts = computed((): Array<Account> => {
    return accountStore.accountArray.filter(
      (a) => !props.excludedAccountIds.includes(a.id)
    );
  });

  function handleSelectChange(): void {
    emit('account-changed', selectedAccountId.value);
  }

</script>
