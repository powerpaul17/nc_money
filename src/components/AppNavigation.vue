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
        @show-details-changed="
          (showDetails) => emit('show-details-changed', showDetails)
        "
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
  import NcAppNavigation from '@nextcloud/vue/dist/Components/NcAppNavigation';
  import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem';
  import NcAppNavigationSpacer from '@nextcloud/vue/dist/Components/NcAppNavigationSpacer';
  import NcAppNavigationNew from '@nextcloud/vue/dist/Components/NcAppNavigationNew';

  import Finance from 'vue-material-design-icons/Finance.vue';
  import Plus from 'vue-material-design-icons/Plus.vue';

  import AppSettings from './AppSettings.vue';
  import BookNavigationItem from './BookNavigationItem.vue';

  import { useBookStore } from '../stores/bookStore';
  import { useBookService } from '../services/bookService';

  const bookStore = useBookStore();
  const bookService = useBookService();

  const emit = defineEmits<{
    (event: 'show-details-changed', showDetails: boolean): void;
  }>();

  async function handleAddBook(): Promise<void> {
    await bookService.addBook({
      name: '',
      description: ''
    });
  }
</script>
