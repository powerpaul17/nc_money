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
      decimals: {
        type: Number,
        default: 2
      },
      decimalSeparator: {
        type: String,
        default: '.'
      },
      groupBy: {
        type: Number,
        default: 3
      },
      groupSeparator: {
        type: String,
        default: ' '
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
          decimals: this.decimals,
          decimalSeparator: this.decimalSeparator,
          groupBy: this.groupBy,
          groupSeparator: this.groupSeparator,
          invertedValue: this.invertedValue
        });
      }
    },
    methods: {
      handleValueChanged(newValue: string) {
        this.currencyValue = this.formattedValue;

        const newNumber = this.mathExpression.evaluate(newValue);
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
        mathExpression: useMathExpression()
      };
    },
    components: { SeamlessInput }
  });
</script>
