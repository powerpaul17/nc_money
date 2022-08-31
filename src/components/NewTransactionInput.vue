<template>
  <div class="flex items-center [&>*]:mx-2">
    <div class="flex-shrink-0">
      <DateInput
        :date="date"
        :placeholder="$t('general.date')"
        @date-changed="(newDate) => (date = newDate)"
      ></DateInput>
    </div>
    <div class="flex-auto">
      <SeamlessInput
        :value="description"
        :placeholder="$t('general.description')"
        @value-changed="(newDescription) => (description = newDescription)"
      >
      </SeamlessInput>
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
        :placeholder="$t('general.value')"
        @value-changed="(newValue) => (value = newValue)"
      ></CurrencyInput>
    </div>
    <div>
      <div v-if="isLoading" class="icon-loading-small"></div>
      <div
        v-else
        class="icon-checkmark"
        @click="handleSubmitTransactionClick"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useTransactionStore } from '../stores/transactionStore';

  import AccountSelect from './AccountSelect.vue';
  import CurrencyInput from './CurrencyInput.vue';
  import DateInput from './DateInput.vue';
  import SeamlessInput from './SeamlessInput.vue';

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
        value: 0.0,
        isLoading: false
      };
    },
    methods: {
      async handleSubmitTransactionClick() {
        // TODO validation
        await this.createNewTransaction();
      },
      async createNewTransaction() {
        this.isLoading = true;
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
        this.isLoading = false;
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
      DateInput,
      SeamlessInput
    }
  });
</script>
