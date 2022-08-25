<template>
  <div class="flex items-center [&>*]:mx-2">
    <div class="flex-shrink-0">
      <DateInput
        :date="date"
        placeholder="Date..."
        @date-changed="(newDate) => (date = newDate)"
      ></DateInput>
    </div>
    <div class="flex-auto">
      <input
        class="w-full"
        placeholder="Description..."
        v-model="description"
      />
    </div>
    <div>
      <AccountSelect
        :excludedAccountIds="[accountId]"
        @account-changed="(accountId) => (destAccountId = accountId)"
      ></AccountSelect>
    </div>
    <div class="flex-shrink-0">
      <CurrencyInput
        :value="value"
        placeholder="Value..."
        @value-changed="(newValue) => (value = newValue)"
      ></CurrencyInput>
    </div>
    <div class="icon-checkmark" @click="handleSubmitTransactionClick"></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useTransactionStore } from '../stores/transactionStore';

  import AccountSelect from './AccountSelect.vue';
  import CurrencyInput from './CurrencyInput.vue';
  import DateInput from './DateInput.vue';

  export default defineComponent({
    props: {
      accountId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        date: new Date(),
        description: '',
        destAccountId: null,
        value: 0.0
      };
    },
    methods: {
      async handleSubmitTransactionClick() {
        // TODO validation
        await this.createNewTransaction();
      },
      async createNewTransaction() {
        const transaction = await this.transactionStore.addTransaction({
          date: this.date,
          description: this.description
        });
        await this.transactionStore.addSplit({
          transactionId: transaction.id,
          value: this.value,
          convertRate: 1.0,
          description: '',
          destAccountId: this.accountId
        });
        if (this.destAccountId) {
          await this.transactionStore.addSplit({
            transactionId: transaction.id,
            value: -this.value,
            convertRate: 1.0,
            description: '',
            destAccountId: this.destAccountId
          });
        }
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
    components: {
      AccountSelect,
      CurrencyInput,
      DateInput
    }
  });
</script>
