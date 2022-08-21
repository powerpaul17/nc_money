<template>
  <li :class="{ active: isSelected }">
    <router-link :to="`/accounts/${account.id}`">
      <div class="flex w-full h-full">
        <div class="flex-auto overflow-hidden text-ellipsis">
          {{ account.name }}
        </div>
        <div class="flex-grow text-right">
          <CurrencyText
            :value="account.balance"
            :animation="true"
          ></CurrencyText>
        </div>
      </div>
    </router-link>
  </li>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';

  import { Account } from '../stores/accountStore';
  import CurrencyText from './CurrencyText.vue';

  export default defineComponent({
    props: {
      account: {
        type: Object as PropType<Account>,
        required: true
      }
    },
    computed: {
      isSelected: function () {
        return Number(this.$route.params.accountId) === this.account.id;
      }
    },
    components: { CurrencyText }
  });
</script>
