<template>
  <SeamlessInput
    :value="currencyValue"
    :placeholder="placeholder"
    :disabled="!editable"
    class="text-right transition-all duration-300 ease-in-out"
    @value-changed="handleValueChanged"
  ></SeamlessInput>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

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
      }
    },
    emits: ['value-changed'],
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
        return this.value.toFixed(2);
      }
    },
    methods: {
      handleValueChanged(newValue: string) {
        this.currencyValue = this.formattedValue;

        const newNumber = Number(newValue);
        if (!Number.isNaN(newNumber)) {
          this.$emit('value-changed', newNumber);
        }
      }
    },
    mounted() {
      this.currencyValue = this.formattedValue;
    },
    components: { SeamlessInput }
  });
</script>
