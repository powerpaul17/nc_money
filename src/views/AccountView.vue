<template>
  <NcAppContent
    v-if="renderComponent"
    :show-details="showDetails"
    @update:showDetails="$emit('show-details-changed', false)"
  >
    <template #list>
      <AccountList
        v-if="selectedAccount"
        :account-type="selectedAccount.type"
      />
    </template>

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

  import AccountList from '../components/AccountList.vue';
  import AccountDetails from '../components/AccountDetails.vue';

  export default defineComponent({
    props: {
      accountId: {
        type: Number,
        required: true
      },
      showDetails: {
        type: Boolean,
        default: true
      }
    },
    emits: [ 'show-details-changed' ],
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
      AccountList,
      AccountDetails
    }
  });
</script>
