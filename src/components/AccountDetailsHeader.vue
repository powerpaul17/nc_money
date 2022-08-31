<template>
  <div>
    <div class="flex flex-auto p-5">
      <div class="flex-auto">
        <div>
          <SeamlessInput
            class="text-lg"
            :placeholder="$t('general.name')"
            :value="account.name"
            @value-changed="handleAccountNameModified"
          ></SeamlessInput>
        </div>
        <div>
          <SeamlessInput
            :placeholder="$t('general.description')"
            :value="account.description"
            @value-changed="handleAccountDescriptionModified"
          ></SeamlessInput>
        </div>
      </div>
    </div>
    <div class="flex p-5">
      <div class="text-right text-xl flex-grow-0 flex-shrink-0 items-center">
        <CurrencyText :value="account.balance" :animation="true"></CurrencyText>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import { type Account, useAccountStore } from '../stores/accountStore';

  import SeamlessInput from './SeamlessInput.vue';
  import CurrencyText from './CurrencyText.vue';

  export default defineComponent({
    props: {
      account: {
        type: Object as PropType<Account>,
        required: true
      }
    },
    data() {
      return {
        accountStore: useAccountStore()
      };
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
    components: {
      SeamlessInput,
      CurrencyText
    }
  });
</script>
