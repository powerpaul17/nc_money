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
        <h2>{{ t('money', 'Properties') }}</h2>

        <div>
          <SeamlessInput
            :value="transaction.description"
            :placeholder="t('money', 'Description')"
            :label="t('money', 'Description')"
            :disabled="!editable"
            @value-changed="handleDescriptionChanged"
          />
        </div>

        <div>
          <DateInput
            :date="transaction.date"
            :placeholder="t('money', 'Date')"
            :label="t('money', 'Date')"
            :editable="editable"
            @date-changed="handleDateChanged"
          />
        </div>
      </div>

      <div>
        <h2>{{ t('money', 'Splits') }}</h2>

        <div
          v-for="split of splitsOfAccount"
          :key="split.id"
        >
          <div class="grid grid-cols-2">
            <div>
              <AccountSelect
                :account-id="split.destAccountId"
                :editable="editable"
                :excluded-account-ids="
                  excludedAccountIds.filter(
                    (accountId) => accountId !== split.destAccountId
                  )
                "
                @account-changed="handleSplitAccountChanged(split, $event)"
              />
            </div>
            <div>
              <CurrencyInput
                :value="split.value"
                :editable="editable"
                :placeholder="t('money', 'Value')"
                :inverted-value="isInvertedAccount"
                @value-changed="handleSplitValueChanged(split, $event)"
              />
            </div>
          </div>
        </div>

        <ArrowDownBold
          :size="36"
          class="my-4 text-background-darker"
        />

        <div
          v-for="split of splitsOfDestinationAccounts"
          :key="split.id"
        >
          <div class="grid grid-cols-2">
            <div>
              <AccountSelect
                :account-id="split.destAccountId"
                :editable="editable"
                :excluded-account-ids="
                  excludedAccountIds.filter(
                    (accountId) => accountId !== split.destAccountId
                  )
                "
                @account-changed="handleSplitAccountChanged(split, $event)"
              />
            </div>
            <div>
              <CurrencyInput
                :value="split.value"
                :editable="editable"
                :placeholder="t('money', 'Value')"
                :inverted-value="!isInvertedAccount"
                @value-changed="handleSplitValueChanged(split, $event)"
              />
            </div>
          </div>
        </div>

        <div
          v-if="isUnbalanced && editable"
          class="grid grid-cols-2"
          :class="{
            'border-t border-solid border-border-dark':
              splitsOfDestinationAccounts.length > 0
          }"
        >
          <div>
            <AccountSelect
              :account-id="newSplitDestAccountId"
              :excluded-account-ids="excludedAccountIds"
              @account-changed="handleNewSplitDestinationAccountIdChanged"
            />
          </div>
          <div>
            <CurrencyInput
              :value="-unbalancedValue"
              :editable="false"
              :placeholder="t('money', 'Value')"
              :inverted-value="isInvertedAccount"
              @value-changed="handleNewSplitValueChanged"
            />
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

  import ArrowDownBold from 'vue-material-design-icons/ArrowDownBold.vue';

  import NcAppSidebar from '@nextcloud/vue/dist/Components/NcAppSidebar';
  import NcAppSidebarTab from '@nextcloud/vue/dist/Components/NcAppSidebarTab';

  import DateInput from '../DateInput.vue';
  import AccountSelect from '../AccountSelect.vue';
  import CurrencyInput from '../CurrencyInput.vue';
  import SeamlessInput from '../SeamlessInput.vue';

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

  watch(
    () => props.transactionId,
    async () => {
      removeTransactionIdWatcher();
      await setTransactionIdWatcher();

      removeSplitsOfTransactionIdWatcher();
      await setSplitsOfTransactionIdWatcher();
    }
  );

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
    await router.push({ name: 'account-view' });
  }

  async function handleDescriptionChanged(description: string): Promise<void> {
    transaction.value!.description = description;
    await handleTransactionChanged();
  }

  async function handleDateChanged(date: Date): Promise<void> {
    transaction.value!.date = date;
    await handleTransactionChanged();
  }

  async function handleSplitAccountChanged(
    split: Split,
    accountId?: number
  ): Promise<void> {
    if (accountId) {
      split.destAccountId = accountId;
      await handleSplitChanged(split);
    } else {
      await splitService.deleteSplit(split);
    }
  }

  async function handleSplitValueChanged(
    split: Split,
    value: number
  ): Promise<void> {
    split.value = value;
    await handleSplitChanged(split);
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
    if (!newSplitValue.value || !newSplitDestAccountId.value) return;

    await splitService.addSplit({
      transactionId: transaction.value!.id,
      destAccountId: newSplitDestAccountId.value,
      value: newSplitValue.value,
      convertRate: 1.0,
      description: ''
    });

    newSplitValue.value = 0.0;
    newSplitDestAccountId.value = null;
  }

  async function handleSplitChanged(split: Split): Promise<void> {
    await splitService.updateSplit(split);
  }

  async function handleTransactionChanged(): Promise<void> {
    await transactionService.updateTransaction(transaction.value!);
  }

  async function setSplitsOfTransactionIdWatcher(): Promise<void> {
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
