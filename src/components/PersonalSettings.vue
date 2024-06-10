<template>
  <NcSettingsSection
    :name="t('money', 'Money')"
    :description="t('money', 'Various settings for the money app')"
  >
    <div class="[&>*]:mt-7">
      <div>
        <label>{{ t('money', 'Decimals') }}</label>
        <br />
        <em>{{
          t(
            'money',
            'Values will be rounded to the selected number of decimals.'
          )
        }}</em>
        <br />

        <select v-model="settingStore.numberFormat_decimals.value">
          <option
            v-for="(option, index) in [0, 1, 2, 3, 4, 5, 6]"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
      </div>

      <div>
        <label>{{ t('money', 'Decimal Separator') }}</label>
        <br />

        <select v-model="settingStore.numberFormat_decimalSeparator.value">
          <option
            v-for="(option, index) in ['.', ',']"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
      </div>

      <div>
        <label>{{ t('money', 'Group By') }}</label>
        <br />
        <em>{{
          t('money', 'Digits will be split into groups of selected size.')
        }}</em>
        <br />

        <select v-model="settingStore.numberFormat_groupBy.value">
          <option
            v-for="(option, index) in [0, 2, 3, 4, 5, 6]"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
      </div>

      <div>
        <label>{{ t('money', 'Group Separator') }}</label>
        <br />

        <select v-model="settingStore.numberFormat_groupSeparator.value">
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
  import { onBeforeMount } from 'vue';

  import { translate as t } from '@nextcloud/l10n';

  import NcSettingsSection from '@nextcloud/vue/dist/Components/NcSettingsSection.js';

  import { useSettingStore } from '../stores/settingStore';
  import { useSettingService } from '../services/settingService';

  const settingStore = useSettingStore();

  onBeforeMount(() => {
    void useSettingService().loadSettings();
  });
</script>
