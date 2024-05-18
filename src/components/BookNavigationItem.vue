<template>
  <NcAppNavigationItem
    :class="{
      'animate-pulse rounded-full [&>.app-navigation-entry.active]:bg-[var(--color-warning)]':
        isDeleting,
      'mb-6': isOpen
    }"
    :name="
      isDeleting
        ? t('money', '\'{bookName}\' deleted', { bookName: book.name })
        : book.name || `(${t('money', 'No name')})`
    "
    :to="{
      name: 'book',
      params: {
        bookId: book.id
      }
    }"
    :allow-collapse="!isDeleting"
    :editable="!isDeleting"
    :edit-label="t('money', 'Rename book')"
    :edit-placeholder="t('money', 'Book name')"
    :loading="isLoading"
    :undo="isDeleting"
    :open="isOpen"
    @update:open="(open) => (isOpen = open)"
    @update:name="handleUpdateBookName"
    @undo="handleUndo"
  >
    <template #icon>
      <NotebookOutline />
    </template>

    <template
      #actions
      v-if="!isDeleting"
    >
      <NcActionButton @click="showDeleteConfirmationDialog = true">
        <template #icon>
          <Delete :size="20" />
        </template>

        {{ t('money', 'Delete book') }}
      </NcActionButton>
    </template>

    <template #default>
      <AccountTypeListItem
        class="first:mt-1"
        v-for="accountType in accountTypes"
        :key="accountType.type"
        :book-id="book.id"
        :account-type="accountType"
        @show-details-changed="($event) => emit('show-details-changed', $event)"
      />

      <li class="border-t border-solid border-main-text" />

      <NcAppNavigationItem :name="t('money', 'Unbalanced')">
        <template #counter>
          <CurrencyText
            class="mr-2"
            :value="unbalancedValue"
            :animation="true"
          />
        </template>
      </NcAppNavigationItem>

      <NcAppNavigationItem :name="t('money', 'Equity')">
        <template #counter>
          <CurrencyText
            class="mr-2"
            :value="equity"
            :animation="true"
          />
        </template>
      </NcAppNavigationItem>
    </template>

    <template #extra>
      <NcModal
        v-if="showDeleteConfirmationDialog"
        @close="() => (showDeleteConfirmationDialog = false)"
        :title="t('money', 'Delete book')"
      >
        <div class="p-8">
          <div class="mb-8">
            <h2>{{ t('money', 'Are you sure?') }}</h2>
            <p>
              {{
                t(
                  'money',
                  'All accounts and transactions of this book will be deleted!'
                )
              }}
            </p>
          </div>
          <div class="flex justify-evenly">
            <NcButton
              type="primary"
              @click="() => (showDeleteConfirmationDialog = false)"
            >
              <template #icon>
                <ArrowLeft />
              </template>

              {{ t('money', 'No, go back') }}
            </NcButton>
            <NcButton @click="handleDeleteBook">
              <template #icon>
                <Delete />
              </template>

              {{ t('money', 'Yes, delete book') }}
            </NcButton>
          </div>
        </div>
      </NcModal>
    </template>
  </NcAppNavigationItem>
</template>

<script setup lang="ts">
  import { computed, ref, type PropType, type Ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem.js';
  import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton.js';
  import NcModal from '@nextcloud/vue/dist/Components/NcModal.js';
  import NcButton from '@nextcloud/vue/dist/Components/NcButton.js';

  import NotebookOutline from 'vue-material-design-icons/NotebookOutline.vue';
  import Delete from 'vue-material-design-icons/Delete.vue';
  import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue';

  import AccountTypeListItem from './AccountTypeListItem.vue';
  import CurrencyText from './CurrencyText.vue';

  import { useAccountStore } from '../stores/accountStore';
  import { useAccountTypeStore } from '../stores/accountTypeStore';
  import type { Book } from '../stores/bookStore';

  import { useBookService } from '../services/bookService';

  const route = useRoute();
  const router = useRouter();

  const accountStore = useAccountStore();
  const accountTypeStore = useAccountTypeStore();

  const bookService = useBookService();

  const props = defineProps({
    book: {
      type: Object as PropType<Book>,
      required: true
    }
  });

  const emit = defineEmits<{
    (event: 'show-details-changed', showDetails: boolean): void;
  }>();

  const accountTypes = computed(() => {
    return accountTypeStore.accountTypes;
  });

  const equity = computed(() => {
    return accountStore.getEquityForBookId(props.book.id).value;
  });

  const unbalancedValue = computed(() => {
    return accountStore.getUnbalancedValueForBookId(props.book.id).value;
  });

  const isLoading = ref(false);

  async function handleUpdateBookName(bookName: string): Promise<void> {
    props.book.name = bookName;

    isLoading.value = true;
    await bookService.updateBook(props.book);
    isLoading.value = false;
  }

  const deleteBookTimeout: Ref<null | number> = ref(null);
  const showDeleteConfirmationDialog = ref(false);

  function handleDeleteBook(): void {
    showDeleteConfirmationDialog.value = false;

    if (deleteBookTimeout.value != null) return;

    deleteBookTimeout.value = window.setTimeout(() => {
      if (Number(route.params.bookId) === props.book.id) void router.push('/');

      void bookService.deleteBook(props.book.id);
    }, 10000);
  }

  function handleUndo(): void {
    if (deleteBookTimeout.value != null) {
      window.clearTimeout(deleteBookTimeout.value);
      deleteBookTimeout.value = null;
    }
  }

  const isDeleting = computed(() => {
    return deleteBookTimeout.value != null;
  });

  const isOpen = ref(false);
</script>
