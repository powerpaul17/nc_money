<template>
  <NcAppNavigationSettings>
    <NcCheckboxRadioSwitch v-model="settingStore.useInvertedAccounts.value">
      {{ t('money', 'Show inverted income/liabilities account balances') }}
    </NcCheckboxRadioSwitch>

    <NcSelect
      v-model="incomeExpenseAccountsValueFormatValue"
      :options="[
        {
          label: t('money', 'Monthly'),
          value: IncomeExpenseAccountsValueFormat.MONTHLY
        },
        {
          label: t('money', 'Yearly'),
          value: IncomeExpenseAccountsValueFormat.YEARLY
        }
      ]"
      label="label"
      >abc</NcSelect
    >
  </NcAppNavigationSettings>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import { translate as t } from '@nextcloud/l10n';

  import {
    IncomeExpenseAccountsValueFormat,
    useSettingStore
  } from '../stores/settingStore';

  import { Utils } from '../utils/utils';

  import NcAppNavigationSettings from '@nextcloud/vue/dist/Components/NcAppNavigationSettings.js';
  import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js';
  import NcSelect from '@nextcloud/vue/dist/Components/NcSelect.js';

  const settingStore = useSettingStore();

  const incomeExpenseAccountsValueFormatValue = computed<{
    label: string;
    value: IncomeExpenseAccountsValueFormat;
  }>({
    get: () => {
      const value = settingStore.incomeExpenseAccountsValueFormat.value;

      return {
        label: t('money', Utils.upperCaseFirstLetter(value)),
        value
      };
    },
    set: (option) => {
      settingStore.incomeExpenseAccountsValueFormat.value = option.value;
    }
  });
</script>
