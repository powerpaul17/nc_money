<template>
  <router-view
    v-if="sidebarVisible"
    name="sidebar"
    class="absolute min-w-[400px]"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const sidebarVisible = computed(() => {
    return route.meta?.showSidebar;
  });
</script>
