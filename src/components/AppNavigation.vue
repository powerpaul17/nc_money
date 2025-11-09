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
          <NcIconSvgWrapper :path="mdiFinance" />
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
          <NcIconSvgWrapper :path="mdiPlus" />
        </template>
      </NcAppNavigationNew>

      <AppSettings />
    </template>
  </NcAppNavigation>
</template>

<script setup lang="ts">
  import { translate as t } from '@nextcloud/l10n';

  import {
    NcAppNavigation,
    NcAppNavigationItem,
    NcAppNavigationSpacer,
    NcAppNavigationNew,
    NcIconSvgWrapper
  } from '@nextcloud/vue';

  import { mdiFinance, mdiPlus } from '@mdi/js';

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
