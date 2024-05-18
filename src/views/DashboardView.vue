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
      <h1 class="mt-4 mb-8 text-xl font-semibold">{{ t('money', 'Books') }}</h1>

      <ul class="list-none">
        <NcListItem
          v-for="book of bookStore.books.value"
          :key="book.id"
          :name="book.name"
          :details="
            NumberUtils.formatNumber(
              accountStore.getEquityForBookId(book.id).value,
              { ...settingStore.numberFormattingOptions.value }
            )
          "
          :to="{
            name: 'book',
            params: {
              bookId: book.id
            }
          }"
        >
          <template #subtitle>
            {{ book.description }}
          </template>

          <template #icon>
            <NotebookOutline />
          </template>
        </NcListItem>
      </ul>
    </div>
  </NcAppContent>
</template>

<script setup lang="ts">
  import NcAppContent from '@nextcloud/vue/dist/Components/NcAppContent.js';
  import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js';
  import NcListItem from '@nextcloud/vue/dist/Components/NcListItem.js';

  import NotebookOutline from 'vue-material-design-icons/NotebookOutline.vue';

  import { useSettingStore } from '../stores/settingStore';

  import { useBookStore } from '../stores/bookStore';
  import { useAccountStore } from '../stores/accountStore';

  import { NumberUtils } from '../utils/numberUtils';

  const settingStore = useSettingStore();

  const bookStore = useBookStore();
  const accountStore = useAccountStore();
</script>
