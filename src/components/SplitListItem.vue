<template>
  <div class="flex items-center [&>*]:mx-2">
    <div />
    <div class="flex-auto">
      <SeamlessInput
        :placeholder="$t('general.description')"
        :value="split.description"
        @value-changed="handleDescriptionChanged"
      />
    </div>
    <div>
      <AccountSelect
        :account-id="split.destAccountId"
        :excluded-account-ids="excludedAccountIds"
        @account-changed="handleDestinationAccountChanged"
      />
    </div>
    <div class="flex-shrink-0">
      <CurrencyInput
        :value="split.value"
        :placeholder="$t('general.value')"
        @value-changed="handleValueChanged"
      />
    </div>
    <div>
      <div
        v-if="showLoadingIcon"
        class="icon-loading-small"
      />
      <div
        v-else
        class="icon-delete"
        @click="handleDeleteSplit"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import type { Split } from '../stores/splitStore';
  import { useSplitService } from '../services/splitService';

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
      }
    },
    emits: ['split-deleted'],
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
    components: { CurrencyInput, AccountSelect, SeamlessInput }
  });
</script>
