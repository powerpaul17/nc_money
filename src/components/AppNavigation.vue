<template>
  <NcAppNavigation>
    <template #list>
      <NcAppNavigationItem
        :name="t('money', 'Overview')"
        :to="{
          name: 'dashboard'
        }"
        :exact="true"
      >
        <template #icon>
          <Finance />
        </template>
      </NcAppNavigationItem>

      <NcAppNavigationSpacer class="order-none" />

      <BookNavigationItem
        v-for="book in bookStore.books.value"
        :key="book.id"
        :book="book"
      />
    </template>

    <template #footer>
      <NcAppNavigationNew
        :text="t('money', 'New book')"
        @click="handleAddBook"
      >
        <template #icon>
          <Plus />
        </template>
      </NcAppNavigationNew>

      <AppSettings />
    </template>
  </NcAppNavigation>
</template>

<script setup lang="ts">
  import { translate as t } from '@nextcloud/l10n';

  import NcAppNavigation from '@nextcloud/vue/dist/Components/NcAppNavigation.js';
  import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem.js';
  import NcAppNavigationSpacer from '@nextcloud/vue/dist/Components/NcAppNavigationSpacer.js';
  import NcAppNavigationNew from '@nextcloud/vue/dist/Components/NcAppNavigationNew.js';

  import Finance from 'vue-material-design-icons/Finance.vue';
  import Plus from 'vue-material-design-icons/Plus.vue';

  import AppSettings from './AppSettings.vue';
  import BookNavigationItem from './BookNavigationItem.vue';

  import { useBookStore } from '../stores/bookStore';
  import { useBookService } from '../services/bookService';

  const bookStore = useBookStore();
  const bookService = useBookService();

  async function handleAddBook(): Promise<void> {
    await bookService.addBook({
      name: '',
      description: ''
    });
  }
</script>
