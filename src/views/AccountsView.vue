<template>
  <div
    class="
      app-content-details
      mx-auto
      flex
      h-[calc(100vh-50px)]
      flex-col
      lg:container
    "
    v-if="renderComponent"
  >
    <AccountDetails
      v-if="selectedAccount"
      :account="selectedAccount"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useAccountStore } from '../stores/accountStore';

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
