<template>
  <label class="flex flex-auto flex-col items-baseline">
    {{ label }}
    <input
      ref="inputRef"
      class="w-full overflow-hidden text-ellipsis border-transparent bg-inherit hover:border-primary-element focus:border-primary-element disabled:text-text-maxcontrast disabled:hover:border-transparent"
      type="text"
      :placeholder="placeholder + '...'"
      :disabled="disabled"
      v-model="inputValue"
      @change="handleValueChange"
      @focus="inputRef?.select()"
      @keyup.escape="inputValue = props.value"
    />
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
