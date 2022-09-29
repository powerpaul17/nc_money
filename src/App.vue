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

<script lang="ts">
  import { defineComponent } from 'vue';

  import AccountTypesList from './components/AccountTypesList.vue';

  export default defineComponent({
    components: {
      AccountTypesList
    }
  });
</script>
