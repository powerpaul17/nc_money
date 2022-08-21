<template>
  <li class="collapsible" :class="{ 'open mb-5': isOpen }">
    <a class="icon-folder" @click.stop="isOpen = !isOpen">
      <div class="flex w-full h-full">
        <div class="flex-auto overflow-hidden text-ellipsis">{{ name }}</div>
        <div class="flex-grow text-right">
        </div>
      </div>
    </a>

    <ul>
    </ul>
  </li>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { AccountType, useAccountStore } from '../stores/accountStore';

  import { AccountType as AccountTypeEntity } from './AccountTypesList.vue';

  export default defineComponent({
    components: {
    },
    props: {
      accountType: {
        type: Object as PropType<AccountTypeEntity>,
        required: true
      }
    },
    data() {
      return {
        isOpen: false,
        AccountType
      };
    },
    computed: {
      name: function () {
        return this.accountType.name;
      },
      balance: function () {
        return this.accountType.balance;
      }
    },
    methods: {
    },
    setup() {
      return { accountStore: useAccountStore() };
    }
  });
</script>
