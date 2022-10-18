<template>
  <li :class="{ active: isSelected }">
    <router-link :to="`/account/${account.id}`">
      <div class="flex h-full w-full">
        <div class="flex-auto overflow-hidden text-ellipsis">
          {{ account.name }}
        </div>
        <div class="grow text-right">
          <CurrencyText
            :value="account.balance"
            :animation="true"
          />
        </div>
      </div>
    </router-link>
  </li>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import type { Account } from '../stores/accountStore';
  import CurrencyText from './CurrencyText.vue';

  export default defineComponent({
    props: {
      account: {
        type: Object as PropType<Account>,
        required: true
      }
    },
    computed: {
      isSelected() {
        return Number(this.$route.params.accountId) === this.account.id;
      }
    },
    components: { CurrencyText }
  });
</script>
