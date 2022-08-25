<template>
  <div class="app-content-details flex flex-col h-[calc(100vh-50px)]">
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
    data() {
      return {
        accountStore: useAccountStore()
      };
    },
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
    components: { AccountDetails }
  });
</script>
