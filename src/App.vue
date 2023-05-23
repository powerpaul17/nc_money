<template>
  <NcContent app-name="money">
    <AppNavigation />

    <router-view />

    <router-view name="sidebar" />
  </NcContent>
</template>

<script setup lang="ts">

  import NcContent from '@nextcloud/vue/dist/Components/NcContent';

  import AppNavigation from './components/AppNavigation.vue';

</script>
