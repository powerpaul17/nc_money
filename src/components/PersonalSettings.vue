<template>
  <NcSettingsSection
    :title="t('money', 'Money')"
    :description="t('money', 'Various settings for the money app')"
  >
    <div class="[&>*]:mt-7">
      <div>
        <label>{{ t('money', 'Decimals') }}</label>
        <br>
        <em>{{ t('money', 'Values will be rounded to the selected number of decimals.') }}</em>
        <br>

        <select v-model="settingStore.numberFormat_decimals">
          <option
            v-for="(option, index) in [ 0, 1, 2, 3, 4, 5, 6 ]"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
      </div>

      <div>
        <label>{{ t('money', 'Decimal Separator') }}</label>
        <br>

        <select v-model="settingStore.numberFormat_decimalSeparator">
          <option
            v-for="(option, index) in [ '.', ',' ]"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
      </div>

      <div>
        <label>{{ t('money', 'Group By') }}</label>
        <br>
        <em>{{ t('money', 'Digits will be split into groups of selected size.') }}</em>
        <br>

        <select v-model="settingStore.numberFormat_groupBy">
          <option
            v-for="(option, index) in [ 0, 2, 3, 4, 5, 6 ]"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
      </div>

      <div>
        <label>{{ t('money', 'Group Separator') }}</label>
        <br>

        <select v-model="settingStore.numberFormat_groupSeparator">
          <option
            v-for="(option, index) in [
              {
                label: t('money', 'Space'),
                value: ' '
              },
              {
                value: '.'
              },
              {
                value: ','
              }
            ]"
            :key="index"
            :value="option.value"
          >
            {{ option.label ?? option.value }}
          </option>
        </select>
      </div>
    </div>
  </NcSettingsSection>
</template>

<script setup lang="ts">

  import NcSettingsSection from '@nextcloud/vue/dist/Components/NcSettingsSection';

  import { useSettingStore } from '../stores/settingStore';

  const settingStore = useSettingStore();

</script>
