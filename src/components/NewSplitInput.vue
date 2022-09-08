<template>
  <div class="flex items-center [&>*]:mx-2">
    <div></div>
    <div class="flex-auto">
      <SeamlessInput
        :value="description"
        :placeholder="$t('general.description')"
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
        :placeholder="$t('general.value')"
        @value-changed="(newValue) => (value = newValue)"
      ></CurrencyInput>
    </div>
    <div>
      <div v-if="isLoading" class="icon-loading-small"></div>
      <div
        v-else
        class="icon-checkmark"
        :class="{ 'opacity-25': !isValid }"
        @click="(event) => isValid && handleSubmitSplitClick(event)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import { useSplitStore } from '../stores/splitStore';

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
        value: 0.0,
        isLoading: false
      };
    },
    watch: {
      initialValue() {
        this.value = this.initialValue ?? 0.0;
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
        await this.splitStore.addSplit({
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
        this.value = this.initialValue ?? 0.0;
      }
    },
    setup() {
      const splitStore = useSplitStore();
      return { splitStore };
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
