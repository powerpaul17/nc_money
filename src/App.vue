<template>
  <NcContent app-name="money">
    <AppNavigation @show-details-changed="($event) => (showDetails = $event)" />

    <router-view
      :show-details="showDetails"
      @show-details-changed="($event) => (showDetails = $event)"
    />

    <router-view name="sidebar" />
  </NcContent>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';

  import NcContent from '@nextcloud/vue/dist/Components/NcContent.js';

  import AppNavigation from './components/AppNavigation.vue';

  import { useSettingService } from './services/settingService';
  import { useAccountService } from './services/accountService';
  import { useBookService } from './services/bookService';

  const showDetails = ref(false);

  onBeforeMount(() => {
    void useSettingService().loadSettings();
    void useAccountService().fetchAccounts();
    void useBookService().fetchBooks();
  });
</script>
