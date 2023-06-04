<template>
  <NcContent app-name="money">
    <AppNavigation />

    <router-view
      :show-details="showDetails"
      @show-details-changed="$event => showDetails = $event"
    />

    <router-view name="sidebar" />
  </NcContent>
</template>

<script setup lang="ts">

  import { ref } from 'vue';

  import NcContent from '@nextcloud/vue/dist/Components/NcContent';

  import AppNavigation from './components/AppNavigation.vue';

  const showDetails = ref(false);

</script>
