<template>
  <CurrencyText
    :value="value"
    :animation="animation"
    :inverted-value="
      settingStore.useInvertedAccounts.value &&
      AccountTypeUtils.isInvertedAccount(accountType)
    "
  >
    <template
      #suffix
      v-if="AccountTypeUtils.isMonthlyAccount(accountType)"
    >
      / {{ suffixText }}
    </template>

    <template
      #second-line
      v-if="!!secondLine"
    >
      <span class="text-sm">{{ secondLine }}</span>
    </template>
  </CurrencyText>
</template>

<script setup lang="ts">
  import { translate as t } from '@nextcloud/l10n';

  import {
    IncomeExpenseAccountsValueFormat,
    useSettingStore
  } from '../stores/settingStore';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import CurrencyText from './CurrencyText.vue';
  import { computed } from 'vue';

  const settingStore = useSettingStore();

  defineProps({
    value: {
      type: Number,
      required: true
    },
    animation: {
      type: Boolean,
      default: true
    },
    accountType: {
      type: Number,
      required: true
    },
    secondLine: {
      type: String,
      default: null
    }
  });

  const suffixText = computed(() => {
    if (
      settingStore.incomeExpenseAccountsValueFormat.value ===
      IncomeExpenseAccountsValueFormat.YEARLY
    ) {
      return t('money', 'yr');
    } else {
      return t('money', 'mo');
    }
  });
</script>
