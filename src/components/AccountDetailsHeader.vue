<template>
  <div class="flex p-5 items-center [&>*]:mr-3 -mr-3">
    <div class="flex flex-auto flex-col">
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
    <div class="flex text-right text-xl flex-grow-0 flex-shrink-0 items-center">
      <CurrencyText :value="account.balance" :animation="true"></CurrencyText>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import { useAccountService } from '../stores/accountService';

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
        accountService: useAccountService()
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
        this.accountService.updateAccount(this.account);
      }
    },
    components: {
      SeamlessInput,
      CurrencyText
    }
  });
</script>
