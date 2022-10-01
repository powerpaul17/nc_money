<template>
  <div class="flex items-center [&>*]:mx-2">
    <div />
    <div class="flex-auto">
      <SeamlessInput
        :value="description"
        :placeholder="$t('general.description')"
        @value-changed="(newDescription) => (description = newDescription)"
      />
    </div>
    <div>
      <AccountSelect
        :excluded-account-ids="excludedAccountIds"
        @account-changed="(accountId) => (destAccountId = accountId)"
      />
    </div>
    <div class="flex-shrink-0">
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
        class="icon-checkmark"
        :class="{ 'opacity-25': !isValid }"
        @click="(event) => isValid && handleSubmitSplitClick(event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import { useSplitService } from '../stores/splitService';

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
        type: Array as PropType<Array<number>>,
        default: () => []
      },
      initialValue: {
        type: Number,
        default: 0.0
      }
    },
    data() {
      return {
        description: '',
        destAccountId: null,
        value: 0.0,
        isLoading: false
      };
    },
    watch: {
      initialValue() {
        this.value = this.initialValue;
      }
    },
    computed: {
      isValid() {
        return this.destAccountId != null && this.value !== 0.0;
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

        this.isLoading = true;
        await this.splitService.addSplit({
          transactionId: this.transactionId,
          destAccountId: this.destAccountId,
          value: this.value,
          convertRate: 1.0,
          description: this.description
        });
        this.isLoading = false;

        this.resetFields();
      },
      resetFields() {
        this.description = '';
        this.destAccountId = null;
        this.value = this.initialValue;
      }
    },
    setup() {
      return { splitService: useSplitService() };
    },
    mounted() {
      this.value = this.initialValue;
    },
    components: {
      SeamlessInput,
      AccountSelect,
      CurrencyInput
    }
  });
</script>
