<template>
  <a
    :href="href"
    class="grid h-12 grid-cols-2 items-center rounded-full px-2 hover:bg-background-hover"
    :key="book.id"
    @click="navigateToRoute()"
  >
    <div class="truncate font-semibold">
      {{ book.name || `(${t('money', 'No name')})` }}
    </div>
    <div class="justify-self-end">
      <div>
        <CurrencyText :value="accountStore.getEquityForBookId(book.id).value" />
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
</template>

<script setup lang="ts">
  import type { PropType } from 'vue';
  import { useRouter, type RouteLocationRaw } from 'vue-router';

  import { translate as t } from '@nextcloud/l10n';

  import type { Book } from '../stores/bookStore';
  import { useAccountStore } from '../stores/accountStore';
  import { AccountTypeType } from '../stores/accountTypeStore';

  import CurrencyText from './CurrencyText.vue';

  const router = useRouter();

  const accountStore = useAccountStore();

  const props = defineProps({
    book: {
      type: Object as PropType<Book>,
      required: true
    },
    href: {
      type: String
    },
    to: {
      type: Object as PropType<RouteLocationRaw>
    }
  });

  function navigateToRoute(): void {
    if (!props.to) return;
    router.push(props.to);
  }
</script>
