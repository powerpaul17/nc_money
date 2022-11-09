<template>
  <div id="app-navigation">
    <AccountTypesList />
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

</script>
