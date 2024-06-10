<template>
  <NcAppNavigationSettings>
    <NcCheckboxRadioSwitch v-model="settingStore.useInvertedAccounts.value">
      {{ t('money', 'Show inverted income/liabilities account balances') }}
    </NcCheckboxRadioSwitch>
  </NcAppNavigationSettings>
</template>

<script setup lang="ts">
  import { translate as t } from '@nextcloud/l10n';

  import { useSettingStore } from '../stores/settingStore';

  import NcAppNavigationSettings from '@nextcloud/vue/dist/Components/NcAppNavigationSettings.js';
  import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js';

  const settingStore = useSettingStore();
</script>
