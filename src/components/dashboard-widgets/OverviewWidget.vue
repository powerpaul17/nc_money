<template>
  <div class="h-full overflow-scroll">
    <BookListItem
      v-for="book of bookStore.books.value"
      :book="book"
      :href="`${generateUrl('apps/money')}/#/book/${book.id}`"
      :key="book.id"
    ></BookListItem>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount } from 'vue';
  import { generateUrl } from '@nextcloud/router';

  import BookListItem from '../BookListItem.vue';

  import { useSettingService } from '../../services/settingService';

  import { useBookStore } from '../../stores/bookStore';

  import { useAccountService } from '../../services/accountService';
  import { useBookService } from '../../services/bookService';

  const bookStore = useBookStore();

  onBeforeMount(() => {
    void useSettingService().loadSettings();
    void useAccountService().fetchAccounts();
    void useBookService().fetchBooks();
  });
</script>
