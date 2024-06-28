<template>
  <NcAppSidebar
    :name="description"
    @close="handleCloseSidebar"
  >
    <NcAppSidebarTab
      class="flex flex-col"
      icon="icon-info"
      :name="t('money', 'Info')"
      id="info-tab"
      :order="1"
      @keyup.enter="handleCreateTransaction()"
    >
      <div>
        <h2>{{ t('money', 'Properties') }}</h2>

        <SeamlessInput
          :value="description"
          :placeholder="t('money', 'Description')"
          :label="t('money', 'Description')"
          @value-changed="handleDescriptionChanged"
        />

        <DateInput
          :date="date"
          :placeholder="t('money', 'Date')"
          :label="t('money', 'Date')"
          @date-changed="handleDateChanged"
        />
      </div>

      <div>
        <h2>{{ t('money', 'Splits') }}</h2>

        <div class="grid grid-cols-2">
          <AccountSelect
            :book-id="bookId"
            :account-id="accountId"
            :editable="false"
          />
          <CurrencyInput
            :value="value"
            :placeholder="t('money', 'Value')"
            :inverted-value="isInvertedAccount"
            @value-changed="handleValueChanged"
          />
          <div class="col-span-2">
            <SeamlessInput
              :value="sourceSplitDescription"
              :placeholder="t('money', 'Description')"
              @value-changed="handleSourceSplitDescriptionChanged"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 border-t border-solid border-border-dark">
          <AccountSelect
            :book-id="bookId"
            :account-id="newDestAccountId"
            :excluded-account-ids="[accountId]"
            @account-changed="handleDestinationAccountIdChanged"
          />
          <CurrencyInput
            :value="-value"
            :placeholder="t('money', 'Value')"
            :inverted-value="isInvertedAccount"
            @value-changed="handleDestinationValueChanged"
          />
          <div class="col-span-2">
            <SeamlessInput
              :value="destSplitDescription"
              :placeholder="t('money', 'Description')"
              @value-changed="handleDestSplitDescriptionChanged"
            />
          </div>
        </div>
      </div>

      <div class="flex-auto"></div>

      <NcButton
        class="self-end"
        type="primary"
        :wide="true"
        :disabled="isLoading || !isValid"
        @click="handleCreateTransaction()"
      >
        <template #icon>
          <div
            v-if="isLoading"
            class="icon-loading-small"
          />
          <Plus
            v-else
            :size="20"
          />
        </template>
        {{ t('money', 'Add transaction') }}
      </NcButton>
    </NcAppSidebarTab>
  </NcAppSidebar>
</template>

<style scoped>
  h2 {
    @apply border-b border-solid border-border-dark text-center pb-2;
  }
</style>

<script setup lang="ts">
  import { translate as t } from '@nextcloud/l10n';

  import { computed, ref, type Ref } from 'vue';
  import { useRouter } from 'vue-router';

  import Plus from 'vue-material-design-icons/Plus.vue';

  import NcAppSidebar from '@nextcloud/vue/dist/Components/NcAppSidebar.js';
  import NcAppSidebarTab from '@nextcloud/vue/dist/Components/NcAppSidebarTab.js';
  import NcButton from '@nextcloud/vue/dist/Components/NcButton.js';

  import DateInput from '../DateInput.vue';
  import AccountSelect from '../AccountSelect.vue';
  import CurrencyInput from '../CurrencyInput.vue';
  import SeamlessInput from '../SeamlessInput.vue';

  import { NumberUtils } from '../../utils/numberUtils';
  import { DateUtils } from '../../utils/DateUtils';

  import { useSettingStore } from '../../stores/settingStore';

  import { useAccountStore } from '../../stores/accountStore';

  import { useTransactionService } from '../../services/transactionService';

  import { AccountTypeUtils } from '../../utils/accountTypeUtils';

  const settingStore = useSettingStore();

  const accountStore = useAccountStore();

  const transactionService = useTransactionService();

  const router = useRouter();

  const props = defineProps({
    bookId: {
      type: Number,
      required: true
    },
    accountId: {
      type: Number,
      required: true
    }
  });

  const description = ref('');
  const date = ref(new Date());

  const value = ref(0.0);

  const newDestAccountId: Ref<number | null> = ref(null);

  const sourceSplitDescription = ref('');
  const destSplitDescription = ref('');

  const isLoading = ref(false);

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

  const isValid = computed(() => NumberUtils.areNotEqual(value.value, 0.0));

  async function handleCloseSidebar(): Promise<void> {
    await router.push({ name: 'account' });
  }

  function handleDescriptionChanged(newDescription: string): void {
    description.value = newDescription;
  }

  function handleDateChanged(newDate: Date): void {
    date.value = newDate;
  }

  function handleDestinationAccountIdChanged(accountId?: number): void {
    newDestAccountId.value = accountId ?? null;
  }

  function handleValueChanged(newValue: number): void {
    value.value = newValue;
  }

  function handleDestinationValueChanged(newValue: number): void {
    value.value = -newValue;
  }

  function handleSourceSplitDescriptionChanged(description: string): void {
    sourceSplitDescription.value = description;
  }

  function handleDestSplitDescriptionChanged(description: string): void {
    destSplitDescription.value = description;
  }

  async function handleCreateTransaction(): Promise<void> {
    if (!isValid.value) return;

    isLoading.value = true;

    const result = await transactionService.addTransactionWithSplits({
      description: description.value,
      date: DateUtils.getDateStringForTransaction(date.value),
      convertRate: 1.0,
      srcAccountId: props.accountId,
      destAccountId: newDestAccountId.value,
      value: -value.value,
      srcSplitComment: sourceSplitDescription.value,
      destSplitComment: destSplitDescription.value
    });

    value.value = 0.0;
    description.value = '';
    sourceSplitDescription.value = '';
    destSplitDescription.value = '';

    await router.push({
      name: 'transaction-details',
      params: {
        bookId: props.bookId,
        transactionId: result.transaction.id,
        accountId: props.accountId
      }
    });

    isLoading.value = false;
  }
</script>
