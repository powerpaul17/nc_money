<template>
  <NcAppNavigationSettings>
    <NcCheckboxRadioSwitch :checked.sync="settingStore.useInvertedAccounts.value">
      {{ t('money', 'Show inverted income/liabilities account balances') }}
    </NcCheckboxRadioSwitch>
  </NcAppNavigationSettings>
</template>

<script setup lang="ts">

  import { useSettingStore } from '../stores/settingStore';

  import NcAppNavigationSettings from '@nextcloud/vue/dist/Components/NcAppNavigationSettings';
  import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch';

  const settingStore = useSettingStore();

</script>
