<template>
  <NcAppContent>
    <NcEmptyContent
      v-if="!bookStore.books.value.length"
      :name="t('money', 'No books available')"
      :description="t('money', 'Go ahead and create one...')"
    >
      <template #icon>
        <NotebookOutline />
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

  import NcAppContent from '@nextcloud/vue/dist/Components/NcAppContent.js';
  import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js';

  import NotebookOutline from 'vue-material-design-icons/NotebookOutline.vue';

  import BookListItem from '../components/BookListItem.vue';

  import { useBookStore } from '../stores/bookStore';

  const bookStore = useBookStore();
</script>
