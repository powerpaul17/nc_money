<template>
  <div>
    <h2 class="text-2xl">{{ title }}</h2>
    <div class="h-96">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">

  defineProps({
    title: {
      type: String,
      required: true
    }
  })

</script>
