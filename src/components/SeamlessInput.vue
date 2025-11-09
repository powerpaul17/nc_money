<template>
  <label
    class="flex h-[36px] w-full items-center rounded-large border-2 border-solid border-transparent hover:border-primary-element focus:border-primary-element disabled:text-text-maxcontrast disabled:hover:border-transparent"
  >
    <slot name="pre"></slot>
    <input
      class="my-0 w-full grow overflow-hidden text-ellipsis border-0 border-none bg-inherit"
      type="text"
      :placeholder="placeholder + '...'"
      :disabled="disabled"
      v-model="inputValue"
      @change="handleValueChange"
      @focus="inputRef?.select()"
      @keyup.escape="inputValue = props.value"
    />
    <slot name="post"></slot>
  </label>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  const props = defineProps({
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits<{
    (event: 'value-changed', value: string): void;
  }>();

  const inputRef = ref<HTMLInputElement | null>(null);

  const inputValue = ref(props.value);

  watch(
    () => props.value,
    () => {
      inputValue.value = props.value;
    }
  );

  function handleValueChange(): void {
    const newValue = inputValue.value;
    inputValue.value = props.value;
    emit('value-changed', newValue);
  }
</script>
