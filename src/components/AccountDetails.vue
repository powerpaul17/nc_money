<template>
  <AccountDetailsHeader
    :account="account"
  ></AccountDetailsHeader>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';

  import { Account } from '../stores/accountStore';

  import AccountDetailsHeader from './AccountDetailsHeader.vue';

  export default defineComponent({
    props: {
      account: {
        type: Object as PropType<Account>,
        required: true
      }
    },
    components: {
      AccountDetailsHeader
    }
  });
</script>
