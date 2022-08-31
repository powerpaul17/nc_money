<template>
  <div class="flex items-center [&>*]:mx-2">
    <div></div>
    <div class="flex-auto">
      <SeamlessInput
        :placeholder="$t('general.description')"
        :value="split.description"
        @value-changed="handleDescriptionChanged"
      ></SeamlessInput>
    </div>
    <div>
      <AccountSelect
        :account-id="split.destAccountId"
        :excludedAccountIds="excludedAccountIds"
        @account-changed="handleDestinationAccountChanged"
      ></AccountSelect>
    </div>
    <div class="flex-shrink-0">
      <CurrencyInput
        :value="split.value"
        :placeholder="$t('general.value')"
        @value-changed="handleValueChanged"
      ></CurrencyInput>
    </div>
    <div>
      <div v-if="_isLoading" class="icon-loading-small"></div>
      <div v-else class="icon-delete" @click="handleDeleteSplit"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import { type Split, useTransactionStore } from '../stores/transactionStore';

  import CurrencyInput from './CurrencyInput.vue';
  import AccountSelect from './AccountSelect.vue';
  import SeamlessInput from './SeamlessInput.vue';

  export default defineComponent({
    props: {
      split: {
        type: Object as PropType<Split>,
        required: true
      },
      excludedAccountIds: {
        type: Object as PropType<Array<number>>,
        default: []
      },
      isLoading: {
        type: Boolean,
        default: false
      }
    },
    emits: ['split-deleted'],
    data() {
      return {
        _isLoading: false
      };
    },
    watch: {
      isLoading() {
        this._isLoading = this.isLoading;
      }
    },
    methods: {
      async handleValueChanged(value: number) {
        this.split.value = value;
        await this.handleSplitChanged();
      },
      async handleDeleteSplit() {
        this._isLoading = true;
        this.$emit('split-deleted', this.split);
      },
      async handleDescriptionChanged(description: string) {
        this.split.description = description;
        await this.handleSplitChanged();
      },
      async handleDestinationAccountChanged(accountId: number) {
        this.split.destAccountId = accountId;
        await this.handleSplitChanged();
      },
      async handleSplitChanged() {
        this._isLoading = true;
        await this.transactionStore.updateSplit(this.split);
        this._isLoading = false;
      }
    },
    mounted() {
      this._isLoading = this.isLoading;
    },
    setup() {
      const transactionStore = useTransactionStore();
      return { transactionStore };
    },
    components: { CurrencyInput, AccountSelect, SeamlessInput }
  });
</script>
