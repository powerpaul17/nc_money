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
            :inverted-value="AccountTypeUtils.isInvertedAccount(account.type)"
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

<script lang="ts">
  import dayjs from 'dayjs';

  import { defineComponent, type PropType } from 'vue';

  import type { Account } from '../stores/accountStore';
  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import CurrencyText from './CurrencyText.vue';

  export default defineComponent({
    props: {
      account: {
        type: Object as PropType<Account>,
        required: true
      }
    },
    data() {
      return {
        AccountTypeUtils
      };
    },
    computed: {
      isSelected() {
        return Number(this.$route.params.accountId) === this.account.id;
      },
      balance() {
        if(AccountTypeUtils.isMonthlyAccount(this.account.type)) {
          const date = dayjs();
          return this.account.stats[date.year()]?.[date.month() + 1] ?? 0.0;
        } else {
          return this.account.balance;
        }
      }
    },
    components: { CurrencyText }
  });
</script>
