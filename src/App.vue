<template>
  <NcContent app-name="money">
    <AppNavigation />

    <NcAppContent>
      <router-view />
    </NcAppContent>

    <router-view name="sidebar" />
  </NcContent>
</template>

<script setup lang="ts">

  import NcContent from '@nextcloud/vue/dist/Components/NcContent';
  import NcAppContent from '@nextcloud/vue/dist/Components/NcAppContent';

  import AppNavigation from './components/AppNavigation.vue';

</script>
