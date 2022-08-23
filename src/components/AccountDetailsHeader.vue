<template>
  <div>
    <div class="flex flex-auto p-5">
      <div class="flex-auto">
        <div>
          <SeamlessInput
            class="text-lg"
            placeholder="Name..."
            :value="account.name"
            @value-changed="handleAccountNameModified"
          ></SeamlessInput>
        </div>
        <div>
          <SeamlessInput
            placeholder="Description..."
            :value="account.description"
            @value-changed="handleAccountDescriptionModified"
          ></SeamlessInput>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';

  import { Account, useAccountStore } from '../stores/accountStore';

  import SeamlessInput from './SeamlessInput.vue';

  export default defineComponent({
    props: {
      account: {
        type: Object as PropType<Account>,
        required: true
      }
    },
    methods: {
      handleAccountNameModified(newName: string) {
        this.account.name = newName;
        this.handleAccountModified();
      },
      handleAccountDescriptionModified(newDescription: string) {
        this.account.description = newDescription;
        this.handleAccountModified();
      },
      handleAccountModified() {
        this.accountStore.updateAccount(this.account);
      }
    },
    setup() {
      const accountStore = useAccountStore();
      return { accountStore };
    },
    components: {
      SeamlessInput
    }
  });
</script>
