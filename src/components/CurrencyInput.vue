<template>
  <SeamlessInput
    :value="currencyValue"
    :placeholder="placeholder"
    :disabled="!editable"
    class="text-right transition-all duration-300 ease-in-out"
    @value-changed="handleValueChanged"
  />
</template>

<script setup lang="ts">

  import { ref, watch, computed, onMounted } from 'vue';

  import { useSettingStore } from '../stores/settingStore';

  import { useMathExpression } from '../utils/mathExpression';
  import { NumberUtils } from '../utils/numberUtils';

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
    }
  });

  const emit = defineEmits([ 'value-changed' ]);

  const currencyValue = ref('');

  const formattedValue = computed(() => {
    return NumberUtils.formatNumber(props.value, {
      decimals: settingStore.numberFormat_decimals.value,
      decimalSeparator: settingStore.numberFormat_decimalSeparator.value,
      groupBy: settingStore.numberFormat_groupBy.value,
      groupSeparator: settingStore.numberFormat_groupSeparator.value,
      invertedValue: props.invertedValue
    });
  });

  watch(formattedValue, () => {
    currencyValue.value = formattedValue.value;
  });

  function handleValueChanged(newValue: string): void {
    currencyValue.value = formattedValue.value;

    const newNumber = mathExpression.evaluate({
      expression: newValue,
      previousValue: props.value
    });

    if (!Number.isNaN(newNumber)) {
      emit(
        'value-changed',
        props.invertedValue ? newNumber * -1.0 : newNumber
      );
    }
  }

  onMounted(() => {
    currencyValue.value = formattedValue.value;
  });

</script>
