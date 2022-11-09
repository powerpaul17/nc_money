<template>
  <div id="app-navigation">
    <AccountTypesList />

    <AppSettings />
  </div>

  <div
    id="app-content"
  >
    <router-view />
  </div>

  <router-view name="sidebar" />
</template>

<script setup lang="ts">

  import AccountTypesList from './components/AccountTypesList.vue';
  import AppSettings from './components/AppSettings.vue';

</script>
