<template>
  <input
    class="border-0 hover:border w-full bg-inherit"
    type="text"
    :placeholder="placeholder"
    :disabled="disabled"
    v-model="inputValue"
    @change="handleValueChange"
  />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    emits: ['value-changed'],
    data() {
      return {
        inputValue: this.value
      };
    },
    watch: {
      value() {
        this.inputValue = this.value;
      }
    },
    methods: {
      handleValueChange() {
        const newValue = this.inputValue;
        this.inputValue = this.value;
        this.$emit('value-changed', newValue);
      }
    }
  });
</script>
