<template>
  <NcAppContent>
    <NcEmptyContent
      v-if="!bookStore.books.value.length"
      :name="t('money', 'No books available')"
      :description="t('money', 'Go ahead and create one...')"
    >
      <template #icon>
        <NcIconSvgWrapper :path="mdiNotebookOutline" />
      </template>
    </NcEmptyContent>

    <div
      v-else
      class="mx-auto flex max-w-5xl flex-col justify-around"
    >
      <h1 class="mb-8 mt-4 text-xl font-semibold">{{ t('money', 'Books') }}</h1>

      <BookListItem
        v-for="book of bookStore.books.value"
        :key="book.id"
        :book="book"
        :to="{
          name: 'book',
          params: {
            bookId: book.id
          }
        }"
      ></BookListItem>
    </div>
  </NcAppContent>
</template>

<script setup lang="ts">
  import { translate as t } from '@nextcloud/l10n';

  import {
    NcAppContent,
    NcEmptyContent,
    NcIconSvgWrapper
  } from '@nextcloud/vue';

  import { mdiNotebookOutline } from '@mdi/js';

  import BookListItem from '../components/BookListItem.vue';

  import { useBookStore } from '../stores/bookStore';

  const bookStore = useBookStore();
</script>
