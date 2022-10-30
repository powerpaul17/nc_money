<template>
  <TransactionListItemTemplate>
    <template #description>
      <SeamlessInput
        :placeholder="t('money', 'Description')"
        :value="split.description"
        @value-changed="handleDescriptionChanged"
      />
    </template>

    <template #account>
      <AccountSelect
        :account-id="split.destAccountId"
        :excluded-account-ids="excludedAccountIds"
        @account-changed="handleDestinationAccountChanged"
      />
    </template>

    <template #amount>
      <CurrencyInput
        :value="split.value"
        :placeholder="t('money', 'Value')"
        :inverted-value="invertedValue"
        @value-changed="handleValueChanged"
      />
    </template>

    <template #actionLast>
      <div
        v-if="showLoadingIcon"
        class="icon-loading-small"
      />
      <div
        v-else
        class="icon-delete"
        @click="handleDeleteSplit"
      />
    </template>
  </TransactionListItemTemplate>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import type { Split } from '../stores/splitStore';
  import { useSplitService } from '../services/splitService';

  import TransactionListItemTemplate from './TransactionListItemTemplate.vue';
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
        type: Array as PropType<Array<number>>,
        default: () => []
      },
      isLoading: {
        type: Boolean,
        default: false
      },
      invertedValue: {
        type: Boolean,
        default: false
      }
    },
    emits: [ 'split-deleted' ],
    data() {
      return {
        showLoadingIcon: false
      };
    },
    watch: {
      isLoading() {
        this.showLoadingIcon = this.isLoading;
      }
    },
    methods: {
      async handleValueChanged(value: number) {
        this.split.value = value;
        await this.handleSplitChanged();
      },
      handleDeleteSplit() {
        this.showLoadingIcon = true;
        this.$emit('split-deleted', this.split);
      },
      async handleDescriptionChanged(description: string) {
        this.split.description = description;
        await this.handleSplitChanged();
      },
      async handleDestinationAccountChanged(accountId: number|null) {
        if(accountId) {
          this.split.destAccountId = accountId;
          await this.handleSplitChanged();
        } else {
          this.handleDeleteSplit();
        }
      },
      async handleSplitChanged() {
        this.showLoadingIcon = true;
        await this.splitService.updateSplit(this.split);
        this.showLoadingIcon = false;
      }
    },
    mounted() {
      this.showLoadingIcon = this.isLoading;
    },
    setup() {
      return { splitService: useSplitService() };
    },
    components: { CurrencyInput, AccountSelect, SeamlessInput, TransactionListItemTemplate }
  });
</script>
