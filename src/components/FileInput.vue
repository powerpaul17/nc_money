<template>
  <div class="relative border-[2px] border-dashed border-gray-300 p-3">
    <div class="text-center text-xl text-gray-300">
      <slot>Click/Drop here!</slot>
    </div>
    <input
      class="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
      type="file"
      :accept="accept"
      :disabled="disabled"
      @change="handleFileChanged"
      ref="fileInput"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  defineProps({
    accept: {
      type: String,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['file-changed']);

  const fileInput = ref<HTMLInputElement | null>(null);

  function handleFileChanged(event: Event): void {
    const target = event.target as HTMLInputElement;

    const fileList = target.files;
    const file = fileList?.[0];

    emit('file-changed', file);

    if (!fileInput.value) throw new Error('file input does not exist');
    fileInput.value.value = '';
  }
</script>
