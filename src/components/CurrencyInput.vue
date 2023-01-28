<template>
  <SeamlessInput
    :value="currencyValue"
    :placeholder="placeholder"
    :disabled="!editable"
    class="text-right transition-all duration-300 ease-in-out"
    @value-changed="handleValueChanged"
  />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useSettingStore } from '../stores/settingStore';

  import { useMathExpression } from '../utils/mathExpression';
  import { NumberUtils } from '../utils/numberUtils';

  import SeamlessInput from './SeamlessInput.vue';

  export default defineComponent({
    props: {
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
    },
    emits: [ 'value-changed' ],
    data() {
      return {
        currencyValue: ''
      };
    },
    watch: {
      formattedValue() {
        this.currencyValue = this.formattedValue;
      }
    },
    computed: {
      formattedValue() {
        return NumberUtils.formatNumber(this.value, {
          decimals: this.settingStore.numberFormat_decimals,
          decimalSeparator: this.settingStore.numberFormat_decimalSeparator,
          groupBy: this.settingStore.numberFormat_groupBy,
          groupSeparator: this.settingStore.numberFormat_groupSeparator,
          invertedValue: this.invertedValue
        });
      }
    },
    methods: {
      handleValueChanged(newValue: string) {
        this.currencyValue = this.formattedValue;

        const newNumber = this.mathExpression.evaluate(newValue, this.value);
        if (!Number.isNaN(newNumber)) {
          this.$emit(
            'value-changed',
            this.invertedValue ? newNumber * -1.0 : newNumber
          );
        }
      }
    },
    mounted() {
      this.currencyValue = this.formattedValue;
    },
    setup() {
      return {
        mathExpression: useMathExpression(),
        settingStore: useSettingStore()
      };
    },
    components: { SeamlessInput }
  });
</script>
