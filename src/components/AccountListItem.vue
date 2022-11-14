<template>
  <li :class="{ active: isSelected }">
    <router-link :to="`/account/${account.id}`">
      <div class="flex h-full w-full">
        <div class="flex-auto overflow-hidden text-ellipsis">
          {{ account.name }}
        </div>
        <div class="grow text-right">
          <CurrencyText
            :value="balance"
            :animation="true"
            :inverted-value="settingStore.useInvertedAccounts && AccountTypeUtils.isInvertedAccount(account.type)"
          >
            <template
              #suffix
              v-if="AccountTypeUtils.isMonthlyAccount(account.type)"
            >
              / {{ t('money', 'mo') }}
            </template>
          </CurrencyText>
        </div>
      </div>
    </router-link>
  </li>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';

  import { computed, type PropType } from 'vue';
  import { useRoute } from 'vue-router';

  import type { Account } from '../stores/accountStore';
  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import { useSettingStore } from '../stores/settingStore';

  import CurrencyText from './CurrencyText.vue';

  const route = useRoute();

  const settingStore = useSettingStore();

  const props = defineProps({
    account: {
      type: Object as PropType<Account>,
      required: true
    }
  });

  const isSelected = computed(() => {
    return Number(route.params.accountId) === props.account.id;
  });

  const balance = computed(() => {
    if (AccountTypeUtils.isMonthlyAccount(props.account.type)) {
      const date = dayjs();
      return props.account.stats[date.year()]?.[date.month() + 1] ?? 0.0;
    } else {
      return props.account.balance;
    }
  });

</script>
