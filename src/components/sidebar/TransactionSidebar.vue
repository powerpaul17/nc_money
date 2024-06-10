<template>
  <NcAppSidebar
    :name="description"
    @close="handleCloseSidebar"
  >
    <NcAppSidebarTab
      icon="icon-info"
      :name="t('money', 'Info')"
      id="info-tab"
      :order="1"
    >
      <div>
        <h2>{{ t('money', 'Properties') }}</h2>

        <SeamlessInput
          :value="description"
          :placeholder="t('money', 'Description')"
          :label="t('money', 'Description')"
          :disabled="!editable"
          @value-changed="handleDescriptionChanged"
        />

        <DateInput
          :date="date"
          :placeholder="t('money', 'Date')"
          :label="t('money', 'Date')"
          :editable="editable"
          @date-changed="handleDateChanged"
        />
      </div>

      <div>
        <h2>{{ t('money', 'Splits') }}</h2>

        <div>
          <SplitInput
            v-for="split of splitsOfAccount"
            class="my-2 border-t border-solid border-border-dark first:border-t-0"
            :key="split.id"
            :book-id="bookId"
            :split="split"
            :excluded-account-ids="excludedAccountIds"
            :editable="editable"
            :inverted-value="isInvertedAccount"
          />

          <SplitInput
            v-for="split of splitsOfDestinationAccounts"
            class="my-2 border-t border-solid border-border-dark first:border-t-0"
            :key="split.id"
            :book-id="bookId"
            :split="split"
            :excluded-account-ids="excludedAccountIds"
            :editable="editable"
            :inverted-value="isInvertedAccount"
          />

          <div
            v-if="isUnbalanced && editable"
            class="grid grid-cols-2 border-t border-solid border-border-dark first:border-t-0"
          >
            <AccountSelect
              :book-id="bookId"
              :account-id="newSplitDestAccountId"
              :excluded-account-ids="excludedAccountIds"
              @account-changed="handleNewSplitDestinationAccountIdChanged"
            />
            <CurrencyInput
              :value="-unbalancedValue"
              :editable="false"
              :placeholder="t('money', 'Value')"
              :inverted-value="isInvertedAccount"
              @value-changed="handleNewSplitValueChanged"
            />
            <div class="col-span-2">
              <SeamlessInput
                :value="newSplitDescription"
                :placeholder="t('money', 'Description')"
                @value-changed="handleNewSplitDescriptionChanged"
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
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';

  import { translate as t } from '@nextcloud/l10n';

  import NcAppSidebar from '@nextcloud/vue/dist/Components/NcAppSidebar.js';
  import NcAppSidebarTab from '@nextcloud/vue/dist/Components/NcAppSidebarTab.js';

  import DateInput from '../DateInput.vue';
  import AccountSelect from '../AccountSelect.vue';
  import CurrencyInput from '../CurrencyInput.vue';
  import SeamlessInput from '../SeamlessInput.vue';
  import SplitInput from '../SplitInput.vue';

  import { NumberUtils } from '../../utils/numberUtils';

  import { useSettingStore } from '../../stores/settingStore';

  import { useAccountStore } from '../../stores/accountStore';

  import {
    useTransactionStore,
    type Transaction
  } from '../../stores/transactionStore';
  import { useTransactionService } from '../../services/transactionService';

  import { useSplitStore, type Split } from '../../stores/splitStore';
  import { useSplitService } from '../../services/splitService';

  import { AccountTypeUtils } from '../../utils/accountTypeUtils';

  let splitsOfTransactionIdWatcher: { stop: () => void } | null = null;
  let transactionIdWatcher: { stop: () => void } | null = null;

  const settingStore = useSettingStore();

  const accountStore = useAccountStore();

  const transactionStore = useTransactionStore();
  const transactionService = useTransactionService();

  const splitStore = useSplitStore();
  const splitService = useSplitService();

  const router = useRouter();

  const props = defineProps({
    bookId: {
      type: Number,
      required: true
    },
    transactionId: {
      type: Number,
      required: true
    },
    accountId: {
      type: Number,
      default: undefined
    },
    editable: {
      type: Boolean,
      default: true
    }
  });

  const transaction: Ref<Transaction | null> = ref(null);

  const description = ref('');
  const date = ref(new Date());

  watch(
    () => props.transactionId,
    async () => {
      removeTransactionIdWatcher();
      await setTransactionIdWatcher();

      removeSplitsOfTransactionIdWatcher();
      await setSplitsOfTransactionIdWatcher();
    }
  );

  watch(transaction, () => {
    description.value = transaction.value?.description ?? '';
    date.value = dayjs(transaction.value?.date).toDate();
  });

  onMounted(() => {
    void setTransactionIdWatcher();
    void setSplitsOfTransactionIdWatcher();
  });

  onUnmounted(() => {
    removeTransactionIdWatcher();
    removeSplitsOfTransactionIdWatcher();
  });

  const splits: Ref<Array<Split>> = ref([]);

  const newSplitValue: Ref<number> = ref(0.0);
  const newSplitDestAccountId: Ref<number | null> = ref(null);
  const newSplitDescription: Ref<string> = ref('');

  const splitsOfAccount = computed(() => {
    return splits.value.filter((s) => s.destAccountId === props.accountId);
  });

  const splitsOfDestinationAccounts = computed(() => {
    return splits.value.filter((s) => s.destAccountId !== props.accountId);
  });

  const excludedAccountIds = computed(() => {
    return splits.value.map((s) => s.destAccountId);
  });

  const account = computed(() => {
    if (!props.accountId) return null;

    return accountStore.getById(props.accountId);
  });

  const isInvertedAccount = computed(() => {
    return (
      !!account.value &&
      settingStore.useInvertedAccounts.value &&
      AccountTypeUtils.isInvertedAccount(account.value.type)
    );
  });

  const unbalancedValue = computed(() => {
    return splits.value.reduce((v, s) => (v += s.value), 0.0);
  });

  const isUnbalanced = computed(() => {
    return NumberUtils.areNotEqual(unbalancedValue.value, 0.0);
  });

  watch(unbalancedValue, () => {
    newSplitValue.value = -unbalancedValue.value;
  });

  async function handleCloseSidebar(): Promise<void> {
    await router.push({ name: 'account' });
  }

  async function handleDescriptionChanged(
    newDescription: string
  ): Promise<void> {
    description.value = newDescription;
    await handleTransactionChanged();
  }

  async function handleDateChanged(newDate: Date): Promise<void> {
    date.value = newDate;
    await handleTransactionChanged();
  }

  async function handleNewSplitDescriptionChanged(
    description: string
  ): Promise<void> {
    newSplitDescription.value = description;
    await createNewSplitIfPossible();
  }

  async function handleNewSplitDestinationAccountIdChanged(
    accountId?: number
  ): Promise<void> {
    newSplitDestAccountId.value = accountId ?? null;
    await createNewSplitIfPossible();
  }

  async function handleNewSplitValueChanged(value: number): Promise<void> {
    newSplitValue.value = value;
    await createNewSplitIfPossible();
  }

  async function createNewSplitIfPossible(): Promise<void> {
    if (
      !transaction.value ||
      !newSplitValue.value ||
      !newSplitDestAccountId.value
    )
      return;

    await splitService.addSplit({
      transactionId: transaction.value.id,
      destAccountId: newSplitDestAccountId.value,
      value: newSplitValue.value,
      convertRate: 1.0,
      description: newSplitDescription.value
    });

    newSplitValue.value = 0.0;
    newSplitDestAccountId.value = null;
    newSplitDescription.value = '';
  }

  async function handleTransactionChanged(): Promise<void> {
    if (!transaction.value) return;

    transaction.value.description = description.value;
    transaction.value.date = dayjs(date.value).format('YYYY-MM-DD');

    await transactionService.updateTransaction(transaction.value);
  }

  async function setSplitsOfTransactionIdWatcher(): Promise<void> {
    if (!props.transactionId) {
      splits.value = [];
      return;
    }

    splitsOfTransactionIdWatcher = await splitStore.watchForTransactionId(
      props.transactionId,
      (s) => {
        splits.value = s;
      }
    );
  }

  function removeSplitsOfTransactionIdWatcher(): void {
    splitsOfTransactionIdWatcher?.stop();
    splitsOfTransactionIdWatcher = null;
  }

  async function setTransactionIdWatcher(): Promise<void> {
    if (!props.transactionId) {
      transaction.value = null;
      return;
    }

    transactionIdWatcher = await transactionStore.watchForId(
      props.transactionId,
      (t) => {
        transaction.value = t;
      }
    );
  }

  function removeTransactionIdWatcher(): void {
    transactionIdWatcher?.stop();
    transactionIdWatcher = null;
  }
</script>
