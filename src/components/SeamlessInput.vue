<template>
  <input
    class="border-transparent hover:border-primary-element focus:border-primary-element w-full bg-inherit overflow-hidden text-ellipsis disabled:text-text-maxcontrast disabled:hover:border-transparent"
    type="text"
    :placeholder="placeholder + '...'"
    :disabled="disabled"
    v-model="inputValue"
    @change="handleValueChange"
    @focus="($event.target as HTMLInputElement).select()"
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
