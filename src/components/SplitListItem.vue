<template>
  <div class="flex items-center [&>*]:mx-2">
    <div></div>
    <div class="flex-auto">
      <SeamlessInput
        :placeholder="$t('description')"
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
        :placeholder="$t('value')"
        @value-changed="handleValueChanged"
      ></CurrencyInput>
    </div>
    <div class="icon-delete" @click="handleDeleteSplit"></div>
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
      }
    },
    emits: ['split-deleted'],
    methods: {
      async handleValueChanged(value: number) {
        this.split.value = value;
        await this.handleSplitChanged();
      },
      async handleDeleteSplit() {
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
        await this.transactionStore.updateSplit(this.split);
      }
    },
    setup() {
      const transactionStore = useTransactionStore();
      return { transactionStore };
    },
    components: { CurrencyInput, AccountSelect, SeamlessInput }
  });
</script>
