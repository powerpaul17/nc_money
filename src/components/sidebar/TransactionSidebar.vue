<template>
  <NcAppSidebar
    v-if="!!transaction"
    :title="transaction.description"
    @close="handleCloseSidebar"
  >
    <NcAppSidebarTab
      icon="icon-info"
      :name="t('money', 'Info')"
      id="info-tab"
      :order="1"
    >
      <div>
        <h2>{{ t('money', 'Splits') }}</h2>

        <div v-for="split of sortedSplits">
          <div class="grid grid-cols-2">
            <div>
              <AccountSelect
                :account-id="split.destAccountId"
                @account-changed="handleSplitAccountChanged(split, $event)"
              />
            </div>
            <div>
              <CurrencyInput
                :value="split.value"
                :placeholder="t('money', 'Value')"
                @value-changed="handleSplitValueChanged(split, $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </NcAppSidebarTab>
  </NcAppSidebar>
</template>

<style scoped>

h2 {
  @apply border-b border-solid border-border-dark text-center pb-2;
}

</style>

<script setup lang="ts">

  import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
  import { useRouter } from 'vue2-helpers/vue-router';

  import NcAppSidebar from '@nextcloud/vue/dist/Components/NcAppSidebar';
  import NcAppSidebarTab from '@nextcloud/vue/dist/Components/NcAppSidebarTab';

  import AccountSelect from '../AccountSelect.vue';
  import CurrencyInput from '../CurrencyInput.vue';

  import { useTransactionStore, type Transaction } from '../../stores/transactionStore';

  import { useSplitStore, type Split } from '../../stores/splitStore';
  import { useSplitService } from '../../services/splitService';

  let splitsOfTransactionIdWatcher: { stop: () => void }|null = null;
  let transactionIdWatcher: { stop: () => void }|null = null;

  const transactionStore = useTransactionStore();

  const splitStore = useSplitStore();
  const splitService = useSplitService();

  const router = useRouter();

  const props = defineProps({
    transactionId: {
      type: Number,
      required: true
    },
    accountId: {
      type: Number,
      required: true
    }
  });

  const transaction: Ref<Transaction|null> = ref(null);
  watch(() => props.transactionId, async () => {
    removeTransactionIdWatcher();
    await setTransactionIdWatcher();

    removeSplitsOfTransactionIdWatcher();
    await setSplitsOfTransactionIdWatcher();
  });

  onMounted(async () => {
    await setTransactionIdWatcher();
    await setSplitsOfTransactionIdWatcher();
  });

  onUnmounted(() => {
    removeTransactionIdWatcher();
    removeSplitsOfTransactionIdWatcher();
  });

  const splits: Ref<Array<Split>> = ref([]);

  const sortedSplits = computed(() => {
    return splits.value.sort((s1, s2) => {
      const s1compareValue = s1.destAccountId === props.accountId ? Number.MIN_SAFE_INTEGER : s1.id;
      const s2compareValue = s2.destAccountId === props.accountId ? Number.MIN_SAFE_INTEGER : s2.id;

      if (s1compareValue === s2compareValue) {
        return s1.id - s2.id;
      }

      return s1compareValue - s2compareValue;
    });
  });

  function handleCloseSidebar() {
    router.push({ name: 'account-view' });
  }

  async function handleSplitAccountChanged(split: Split, accountId?: number) {
    if (accountId) {
      split.destAccountId = accountId;
      await handleSplitChanged(split);
    } else {
      await splitService.deleteSplit(split);
    }
  }

  async function handleSplitValueChanged(split: Split, value: number) {
    split.value = value;
    await handleSplitChanged(split);
  }

  async function handleSplitChanged(split: Split) {
    await splitService.updateSplit(split);
  }

  async function setSplitsOfTransactionIdWatcher() {
    splitsOfTransactionIdWatcher = await splitStore.watchForTransactionId(
      props.transactionId,
      (s) => {
        splits.value = s;
      }
    );
  }

  function removeSplitsOfTransactionIdWatcher() {
    splitsOfTransactionIdWatcher?.stop();
    splitsOfTransactionIdWatcher = null;
  }

  async function setTransactionIdWatcher() {
    transactionIdWatcher = await transactionStore.watchForId(
      props.transactionId,
      (t) => {
        transaction.value = t;
      }
    );
  }

  function removeTransactionIdWatcher() {
    transactionIdWatcher?.stop();
    transactionIdWatcher = null;
  }

</script>
