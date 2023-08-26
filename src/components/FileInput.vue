<template>
  <div class="relative border-[2px] border-dashed border-gray-300 p-3">
    <div class="text-center text-xl text-gray-300">
      <slot>Click/Drop here!</slot>
    </div>
    <input
      class="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
      type="file"
      :accept="accept"
      :disabled="disabled"
      @change="handleFileChanged"
      ref="fileInput"
    >
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      accept: {
        type: String,
        default: undefined
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    emits: [ 'file-changed' ],
    methods: {
      handleFileChanged(event: Event) {
        const target = event.target as HTMLInputElement;

        const fileList = target.files;
        const file = fileList?.[0];

        this.$emit('file-changed', file);

        this.$refs.fileInput.value = '';
      }
    }
  });
</script>
