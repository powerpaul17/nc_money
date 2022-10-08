<template>
  <div
    class="
        grid
        h-[45px]
        grid-cols-transactionListItem
        items-center

        [&>*]:flex
        [&>*]:h-full
        [&>*]:items-center
        [&>*:first-child]:justify-center
        [&>*:last-child]:justify-center
        [&>*:not(:first-child):not(:last-child)]:mx-2
      "
    :class="itemClass"
  >
    <div>
      <slot name="actionFirst" />
    </div>
    <div>
      <slot name="date">
        <div
          v-if="isLoading"
          class="tombstone"
        />
      </slot>
    </div>
    <div>
      <slot name="description">
        <div
          v-if="isLoading"
          class="tombstone"
        />
      </slot>
    </div>
    <div class="justify-center">
      <slot name="account">
        <div
          v-if="isLoading"
          class="tombstone"
        />
      </slot>
    </div>
    <div>
      <slot name="amount">
        <div
          v-if="isLoading"
          class="tombstone"
        />
      </slot>
    </div>
    <div>
      <slot name="actionLast" />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    itemClass: {
      type: Object,
      default: () => ({})
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  });
</script>

<style>
  .tombstone {
    @apply w-full h-4 rounded-full bg-background-dark animate-pulse
  }
</style>
