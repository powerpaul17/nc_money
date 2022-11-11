<template>
  <NcAppNavigationSettings>
    <NcCheckboxRadioSwitch v-model:checked="settingStore.useInvertedAccounts">
      {{ t('money', 'Show inverted income/liabilities account balances') }}
    </NcCheckboxRadioSwitch>
  </NcAppNavigationSettings>
</template>

<script setup lang="ts">
  import { useSettingStore } from '../stores/settingStore';

  import NcAppNavigationSettings from '../vendor/nextcloud-vue/src/components/NcAppNavigationSettings';
  import NcCheckboxRadioSwitch from '../vendor/nextcloud-vue/src/components/NcCheckboxRadioSwitch';

  const settingStore = useSettingStore();
</script>
