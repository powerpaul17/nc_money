<template>
  <div class="h-full overflow-scroll">
    <a
      :href="linkTo('money', `books/${book.id}`)"
      class="grid h-12 grid-cols-2 items-center rounded-full px-2 hover:bg-background-hover"
      v-for="book of bookStore.books.value"
      :key="book.id"
    >
      <div class="truncate font-semibold">{{ book.name }}</div>
      <div class="justify-self-end">
        <div>
          <CurrencyText
            :value="accountStore.getEquityForBookId(book.id).value"
          />
        </div>
        <div class="flex text-xs">
          <CurrencyText
            class="mr-1 text-green-500"
            :value="
              accountStore.getSummaryByType({
                bookId: book.id,
                accountType: AccountTypeType.INCOME
              }).value
            "
          >
            <template #prefix>▴</template>
          </CurrencyText>

          <CurrencyText
            class="text-red-500"
            :value="
              accountStore.getSummaryByType({
                bookId: book.id,
                accountType: AccountTypeType.EXPENSE
              }).value
            "
          >
            <template #prefix>▾</template>
          </CurrencyText>
        </div>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount } from 'vue';
  import { linkTo } from '@nextcloud/router';

  import CurrencyText from '../CurrencyText.vue';

  import { useSettingService } from '../../services/settingService';

  import { useAccountStore } from '../../stores/accountStore';

  import { useBookStore } from '../../stores/bookStore';

  import { useAccountService } from '../../services/accountService';
  import { useBookService } from '../../services/bookService';

  import { AccountTypeType } from '../../stores/accountTypeStore';

  const accountStore = useAccountStore();
  const bookStore = useBookStore();

  onBeforeMount(() => {
    void useSettingService().loadSettings();
    void useAccountService().fetchAccounts();
    void useBookService().fetchBooks();
  });
</script>
