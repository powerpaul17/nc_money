<template>
  <NcContent app-name="money">
    <AppNavigation />

    <router-view />

    <router-view name="sidebar" />
  </NcContent>
</template>

<script setup lang="ts">
  import { onBeforeMount } from 'vue';

  import { NcContent } from '@nextcloud/vue';

  import AppNavigation from './components/AppNavigation.vue';

  import { useSettingService } from './services/settingService';
  import { useAccountService } from './services/accountService';
  import { useBookService } from './services/bookService';

  onBeforeMount(() => {
    void useSettingService().loadSettings();
    void useAccountService().fetchAccounts();
    void useBookService().fetchBooks();
  });
</script>
