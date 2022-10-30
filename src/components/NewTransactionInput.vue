<template>
  <TransactionListItemTemplate>
    <template #date>
      <DateInput
        :date="date"
        :placeholder="t('money', 'Date')"
        @date-changed="(newDate) => (date = newDate)"
      />
    </template>

    <template #description>
      <SeamlessInput
        :value="description"
        :placeholder="t('money', 'Description')"
        @value-changed="(newDescription) => (description = newDescription)"
      />
    </template>

    <template #account>
      <AccountSelect
        :excluded-account-ids="[accountId]"
        @account-changed="(accountId) => (destAccountId = accountId)"
      />
    </template>

    <template #amount>
      <CurrencyInput
        :value="value"
        :placeholder="t('money', 'Value')"
        :inverted-value="invertedValue"
        @value-changed="(newValue) => (value = newValue)"
      />
    </template>

    <template #actionLast>
      <div
        v-if="isLoading"
        class="icon-loading-small"
      />
      <div
        v-else
        class="icon-confirm"
        :class="{ 'opacity-25': !isValid }"
        @click="() => isValid && handleSubmitTransactionClick()"
      />
    </template>
  </TransactionListItemTemplate>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useTransactionService } from '../services/transactionService';

  import TransactionListItemTemplate from './TransactionListItemTemplate.vue';
  import AccountSelect from './AccountSelect.vue';
  import CurrencyInput from './CurrencyInput.vue';
  import DateInput from './DateInput.vue';
  import SeamlessInput from './SeamlessInput.vue';

  export default defineComponent({
    props: {
      accountId: {
        type: Number,
        required: true
      },
      invertedValue: {
        type: Boolean,
        default: false
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
    computed: {
      isValid() {
        return this.value !== 0.0;
      }
    },
    methods: {
      async handleSubmitTransactionClick() {
        // TODO validation
        await this.createNewTransaction();
      },
      async createNewTransaction() {
        this.isLoading = true;
        await this.transactionService.addTransactionWithSplits({
          date: this.date,
          description: this.description,
          value: -this.value,
          convertRate: 1.0,
          srcAccountId: this.accountId,
          destAccountId: this.destAccountId
        });
        this.isLoading = false;
        this.resetFields();
      },
      resetFields() {
        this.description = '';
        this.value = 0.0;
      }
    },
    setup() {
      return {
        transactionService: useTransactionService()
      };
    },
    components: {
      AccountSelect,
      CurrencyInput,
      DateInput,
      SeamlessInput,
      TransactionListItemTemplate
    }
  });
</script>
