<template>
  <div class="grid grid-cols-2">
    <AccountSelect
      :book-id="bookId"
      :account-id="split.destAccountId"
      :editable="editable"
      :excluded-account-ids="
        excludedAccountIds.filter(
          (accountId) => accountId !== split.destAccountId
        )
      "
      @account-changed="handleSplitAccountChanged(split, $event)"
    />
    <CurrencyInput
      :value="value"
      :editable="editable"
      :placeholder="t('money', 'Value')"
      :inverted-value="invertedValue"
      :enable-convert-rate="enableConvertRate"
      :convert-rate="convertRate / split.convertRate"
      @value-changed="handleSplitValueChanged(split, $event)"
      @convert-rate-changed="handleSplitConvertRateChanged(split, $event)"
    />
    <div class="col-span-2">
      <SeamlessInput
        :value="split.description"
        :placeholder="t('money', 'Description')"
        @value-changed="handleSplitDescriptionChanged(split, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, type PropType } from 'vue';

  import { translate as t } from '@nextcloud/l10n';

  import AccountSelect from './AccountSelect.vue';
  import CurrencyInput from './CurrencyInput.vue';
  import SeamlessInput from './SeamlessInput.vue';

  import type { Split } from '../stores/splitStore';
  import { useSplitService } from '../services/splitService';

  import { useAccountStore } from '../stores/accountStore';

  const splitService = useSplitService();
  const accountStore = useAccountStore();

  const props = defineProps({
    bookId: {
      type: Number,
      required: true
    },
    split: {
      type: Object as PropType<Split>,
      required: true
    },
    excludedAccountIds: {
      type: Array as PropType<Array<number>>,
      default: () => []
    },
    invertedValue: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    sourceAccountId: {
      type: Number,
      required: true
    },
    convertRate: {
      type: Number,
      default: 1.0
    }
  });

  const sourceAccount = computed(() => {
    return props.sourceAccountId
      ? accountStore.getById(props.sourceAccountId)
      : undefined;
  });

  const destAccount = computed(() => {
    return accountStore.getById(props.split.destAccountId);
  });

  const enableConvertRate = computed(() => {
    return (
      !!sourceAccount.value &&
      !!destAccount.value &&
      sourceAccount.value.currency !== destAccount.value.currency
    );
  });

  const value = computed(() => {
    if (enableConvertRate.value) {
      return (props.split.value * props.split.convertRate) / props.convertRate;
    } else {
      return props.split.value;
    }
  });

  async function handleSplitAccountChanged(
    split: Split,
    accountId?: number
  ): Promise<void> {
    if (accountId) {
      split.destAccountId = accountId;
      await handleSplitChanged(split);
    } else {
      await splitService.deleteSplit(split);
    }
  }

  async function handleSplitValueChanged(
    split: Split,
    value: number
  ): Promise<void> {
    // TODO: calculate right value with convert rate(s)!
    split.value = value;
    await handleSplitChanged(split);
  }

  async function handleSplitDescriptionChanged(
    split: Split,
    description: string
  ): Promise<void> {
    split.description = description;
    await handleSplitChanged(split);
  }

  async function handleSplitConvertRateChanged(
    split: Split,
    convertRate: number
  ): Promise<void> {
    split.convertRate = props.convertRate / convertRate;
    await handleSplitChanged(split);
  }

  async function handleSplitChanged(split: Split): Promise<void> {
    await splitService.updateSplit(split);
  }
</script>
