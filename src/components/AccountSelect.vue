<template>
  <select
    :disabled="!editable"
    v-model="selectedAccountId"
    @change="handleSelectChange"
  >
    <option :value="null">-- No Account --</option>
    <option v-for="account in accounts" :key="account.id" :value="account.id">
      {{ account.name }}
    </option>
  </select>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import { useAccountStore } from '../stores/accountStore';

  export default defineComponent({
    props: {
      accountId: {
        type: Number,
        default: null
      },
      editable: {
        type: Boolean,
        default: true
      },
      excludedAccountIds: {
        type: Object as PropType<Array<number>>,
        default: []
      }
    },
    emits: ['account-changed'],
    data() {
      return {
        accountStore: useAccountStore(),
        selectedAccountId: this.accountId
      };
    },
    computed: {
      accounts() {
        return this.accountStore.accounts.filter(
          (a) => !this.excludedAccountIds.includes(a.id)
        );
      }
    },
    watch: {
      accountId() {
        this.selectedAccountId = this.accountId;
      }
    },
    methods: {
      handleSelectChange(event) {
        this.$emit('account-changed', this.selectedAccountId);
      }
    }
  });
</script>
