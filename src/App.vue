<template>
  <AppNavigation />

  <div id="app-content">
    <router-view />
  </div>

  <router-view name="sidebar" />
</template>

<script setup lang="ts">

  import AppNavigation from './components/AppNavigation.vue';

</script>
