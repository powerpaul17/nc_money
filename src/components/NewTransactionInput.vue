<template>
  <div
    class="
      grid
      grid-cols-transactionListItem
      items-center
      [&>*]:mx-2
    "
  >
    <div />
    <div>
      <DateInput
        :date="date"
        :placeholder="$t('general.date')"
        @date-changed="(newDate) => (date = newDate)"
      />
    </div>
    <div>
      <SeamlessInput
        :value="description"
        :placeholder="$t('general.description')"
        @value-changed="(newDescription) => (description = newDescription)"
      />
    </div>
    <div>
      <AccountSelect
        :excluded-account-ids="[accountId]"
        @account-changed="(accountId) => (destAccountId = accountId)"
      />
    </div>
    <div>
      <CurrencyInput
        :value="value"
        :placeholder="$t('general.value')"
        @value-changed="(newValue) => (value = newValue)"
      />
    </div>
    <div>
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
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useTransactionService } from '../services/transactionService';

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
      SeamlessInput
    }
  });
</script>
