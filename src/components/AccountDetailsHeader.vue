<template>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';

  import { Account, useAccountStore } from '../stores/accountStore';

  export default defineComponent({
    props: {
      account: {
        type: Object as PropType<Account>,
        required: true
      }
    }
  });
</script>
