<template>
  <div id="app-navigation">
    <AccountTypesList></AccountTypesList>
  </div>

  <div id="app-content">
    <router-view></router-view>
  </div>
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
