<template>
  <div
    class="flex h-14 items-center [&>*]:flex"
    :class="itemClass"
    @click="emit('click')"
  >
    <div class="pr-3">
      <slot name="icon" />
    </div>

    <div class="grow">
      <slot name="content" />
    </div>

    <div class="shrink-0 justify-end text-xl">
      <slot name="amount" />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    itemClass: {
      type: Object,
      default: () => ({})
    }
  });

  const emit = defineEmits(['click']);
</script>
