<template>
  <div class="flex items-center [&>*]:mx-2">
    <div></div>
    <div class="flex-auto">
      <SeamlessInput
        :value="description"
        :placeholder="$t('description')"
        @value-changed="(newDescription) => (description = newDescription)"
      ></SeamlessInput>
    </div>
    <div>
      <AccountSelect
        :excludedAccountIds="excludedAccountIds"
        @account-changed="(accountId) => (destAccountId = accountId)"
      ></AccountSelect>
    </div>
    <div class="flex-shrink-0">
      <CurrencyInput
        :value="value"
        :placeholder="$t('value')"
        @value-changed="(newValue) => (value = newValue)"
      ></CurrencyInput>
    </div>
    <div class="icon-checkmark" @click="handleSubmitSplitClick"></div>
  </div>
</template>

<i18n>
{
  "en": {
    "description": "Description...",
    "value": "Value..."
  }
}
</i18n>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import { useTransactionStore } from '../stores/transactionStore';
  import SeamlessInput from './SeamlessInput.vue';
  import AccountSelect from './AccountSelect.vue';
  import CurrencyInput from './CurrencyInput.vue';

  export default defineComponent({
    props: {
      transactionId: {
        type: Number,
        required: true
      },
      excludedAccountIds: {
        type: Object as PropType<Array<number>>,
        default: []
      },
      initialValue: {
        type: Number
      }
    },
    data() {
      return {
        description: '',
        destAccountId: null,
        value: 0.0
      };
    },
    watch: {
      initialValue() {
        this.value = this.initialValue ?? 0.0;
      }
    },
    methods: {
      async handleSubmitSplitClick() {
        // TODO validation
        await this.createNewSplit();
      },
      async createNewSplit() {
        if (!this.destAccountId)
          throw new Error('cannot add split without an account id');

        await this.transactionStore.addSplit({
          transactionId: this.transactionId,
          destAccountId: this.destAccountId,
          value: this.value,
          convertRate: 1.0,
          description: this.description
        });
        this.resetFields();
      },
      resetFields() {
        this.description = '';
        this.value = 0.0;
      }
    },
    setup() {
      const transactionStore = useTransactionStore();
      return { transactionStore };
    },
    mounted() {
      this.value = this.initialValue ?? 0.0;
    },
    components: {
      SeamlessInput,
      AccountSelect,
      CurrencyInput
    }
  });
</script>
