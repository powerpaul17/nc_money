<template>
  <router-view
    v-if="sidebarVisible"
    name="sidebar"
    class="h-[calc(100vh-50px)]"
  />
</template>

<script setup lang="ts">

  import { computed } from 'vue';
  import { useRoute } from 'vue2-helpers/vue-router';

  const route = useRoute();

  const sidebarVisible = computed(() => {
    return route.meta?.showSidebar;
  });

</script>
