<template>
  <SeamlessInput
    :value="valueString"
    :placeholder="placeholder"
    :disabled="!editable"
    class="text-right transition-all duration-300 ease-in-out"
    @value-changed="handleValueStringChanged"
  >
    <template
      v-if="enableConvertRate"
      #post
    >
      <NcPopover
        popover-base-class="rounded-large"
        no-focus-trap
      >
        <template #trigger>
          <NcButton
            variant="tertiary-no-background"
            :disabled="!editable"
          >
            <template #icon>
              <NcIconSvgWrapper :path="mdiSwapHorizontal" />
            </template>
          </NcButton>
        </template>

        <template #default>
          <div class="flex flex-col gap-2 p-2">
            <NcInputField
              v-model="convertRateString"
              :label="t('money', 'Convert rate')"
              :label-visible="true"
              :placeholder="t('money', 'Convert rate') + '...'"
              @keydown.enter="handleConvertRateStringChanged"
              @focusout="handleConvertRateStringChanged"
            >
              <template #trailing-button-icon>
                <NcIconSvgWrapper :path="mdiSwapHorizontal" />
              </template>
            </NcInputField>

            <NcInputField
              v-model="foreignValueString"
              :label="t('money', 'Foreign value')"
              :label-visible="true"
              :placeholder="t('money', 'Foreign value') + '...'"
              @keydown.enter="handleForeignValueStringChanged"
              @focusout="handleForeignValueStringChanged"
            >
              <template #trailing-button-icon>
                <NcIconSvgWrapper :path="mdiCashMultiple" />
              </template>
            </NcInputField>
          </div>
        </template>
      </NcPopover>
    </template>
  </SeamlessInput>
</template>

<script setup lang="ts">
  import { ref, watch, computed, onMounted } from 'vue';

  import { translate as t } from '@nextcloud/l10n';

  import { useSettingStore } from '../stores/settingStore';

  import { useMathExpression } from '../utils/mathExpression';
  import { NumberUtils } from '../utils/numberUtils';

  import {
    NcPopover,
    NcButton,
    NcInputField,
    NcIconSvgWrapper
  } from '@nextcloud/vue';

  import { mdiSwapHorizontal, mdiCashMultiple } from '@mdi/js';

  import SeamlessInput from './SeamlessInput.vue';

  const mathExpression = useMathExpression();
  const settingStore = useSettingStore();

  const props = defineProps({
    value: {
      type: Number,
      required: true
    },
    editable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    invertedValue: {
      type: Boolean,
      default: false
    },
    enableConvertRate: {
      type: Boolean,
      default: false
    },
    convertRate: {
      type: Number,
      default: 1.0
    }
  });

  const emit = defineEmits(['value-changed', 'convert-rate-changed']);

  const valueString = ref('');

  const convertRateString = ref('');
  const foreignValueString = ref('');

  const foreignValue = computed(() => {
    return props.value * props.convertRate;
  });

  const formattedValueString = computed(() => {
    return NumberUtils.formatNumber(props.value, getSettings());
  });

  const formattedConvertRateString = computed(() => {
    return NumberUtils.formatNumber(props.convertRate, getSettings(2));
  });

  const formattedForeignValueString = computed(() => {
    return NumberUtils.formatNumber(foreignValue.value, getSettings());
  });

  watch(formattedValueString, () => {
    valueString.value = formattedValueString.value;
  });

  watch(formattedConvertRateString, () => {
    convertRateString.value = formattedConvertRateString.value;
  });

  watch(formattedForeignValueString, () => {
    foreignValueString.value = formattedForeignValueString.value;
  });

  function getSettings(decimalsFactor = 1): {
    decimals: number;
    decimalSeparator: string;
    groupBy: number;
    groupSeparator: string;
    invertedValue: boolean;
  } {
    return {
      decimals: settingStore.numberFormat_decimals.value * decimalsFactor,
      decimalSeparator: settingStore.numberFormat_decimalSeparator.value,
      groupBy: settingStore.numberFormat_groupBy.value,
      groupSeparator: settingStore.numberFormat_groupSeparator.value,
      invertedValue: props.invertedValue
    };
  }

  function handleValueStringChanged(newValue: string): void {
    const newNumber = getNumberFromExpression(newValue, props.value);
    if (Number.isNaN(newNumber)) return;

    emit('value-changed', props.invertedValue ? newNumber * -1.0 : newNumber);
  }

  function handleConvertRateStringChanged(): void {
    const newConvertRate = getNumberFromExpression(
      convertRateString.value,
      props.convertRate
    );
    if (Number.isNaN(newConvertRate)) return;

    emit('convert-rate-changed', newConvertRate);
  }

  function handleForeignValueStringChanged(): void {
    const newForeignValue = getNumberFromExpression(
      foreignValueString.value,
      foreignValue.value
    );
    if (Number.isNaN(newForeignValue)) return;

    const newConvertRate = NumberUtils.areEqual(props.value, 0.0)
      ? 1.0
      : newForeignValue / props.value;

    emit('convert-rate-changed', newConvertRate);
  }

  function getNumberFromExpression(
    stringValue: string,
    initialValue?: number
  ): number {
    return mathExpression.evaluate({
      expression: stringValue,
      previousValue: initialValue,
      numberFormat: {
        decimalSeparator: settingStore.numberFormat_decimalSeparator.value,
        groupSeparator: settingStore.numberFormat_groupSeparator.value
      }
    });
  }

  onMounted(() => {
    valueString.value = formattedValueString.value;
    convertRateString.value = formattedConvertRateString.value;
    foreignValueString.value = formattedForeignValueString.value;
  });
</script>
