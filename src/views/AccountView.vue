<template>
  <NcAppContent
    v-if="renderComponent"
  >
    <AccountDetails
      v-if="selectedAccount"
      :account="selectedAccount"
    />
  </NcAppContent>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useAccountStore, type Account } from '../stores/accountStore';

  import NcAppContent from '@nextcloud/vue/dist/Components/NcAppContent';

  import AccountDetails from '../components/AccountDetails.vue';

  export default defineComponent({
    props: {
      accountId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        renderComponent: true,
        accountStore: useAccountStore()
      };
    },
    computed: {
      selectedAccount() {
        return this.accountStore.getById(this.accountId);
      }
    },
    watch: {
      selectedAccount(newAccount: Account, oldAccount?: Account) {
        if(newAccount.id !== oldAccount?.id) this.forceRerender();
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
    components: {
      NcAppContent,
      AccountDetails
    }
  });
</script>
