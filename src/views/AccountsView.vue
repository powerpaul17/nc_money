<template>
  <div
    class="app-content-details flex flex-col h-[calc(100vh-50px)] lg:container mx-auto"
    v-if="renderComponent"
  >
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
        renderComponent: true,
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
    watch: {
      selectedAccount() {
        this.forceRerender();
      }
    },
    methods: {
      forceRerender() {
        this.renderComponent = false;
        this.$nextTick(() => {
          this.renderComponent = true;
        });
      }
    },
    components: { AccountDetails }
  });
</script>
