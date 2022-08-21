<template>
  <div class="app-content-details">
    <AccountDetails
      v-if="selectedAccount"
      :account="selectedAccount"
    ></AccountDetails>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useAccountStore } from '../stores/accountStore';

  import AccountDetails from '../components/AccountDetails.vue';

  export default defineComponent({
    computed: {
      selectedAccount() {
        const accountId = this.$route.params.accountId;
        if (accountId) {
          return this.accountStore.getById(Number(accountId));
        } else {
          return null;
        }
      }
    },
    setup() {
      const accountStore = useAccountStore();
      return { accountStore };
    },
    components: { AccountDetails }
  });
</script>
