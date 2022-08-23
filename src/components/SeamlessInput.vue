<template>
  <input
    class="border-0 hover:border w-full bg-inherit"
    type="text"
    :placeholder="placeholder"
    v-model.lazy="inputValue"
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
        this.$emit('value-changed', this.inputValue);
      }
    }
  });
</script>
