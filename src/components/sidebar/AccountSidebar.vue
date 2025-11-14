<template>
  <NcAppSidebar
    :name="name"
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
      </div>

      <!-- <div>
        <h2>{{ t('money', 'Splits') }}</h2>
      </div> -->
    </NcAppSidebarTab>
  </NcAppSidebar>
</template>

<style scoped>
  h2 {
    @apply border-b border-solid border-border-dark text-center pb-2;
  }
</style>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';

  import { translate as t } from '@nextcloud/l10n';

  import { NcAppSidebar, NcAppSidebarTab } from '@nextcloud/vue';

  import SeamlessInput from '../SeamlessInput.vue';

  import { useSettingStore } from '../../stores/settingStore';

  import { useAccountStore } from '../../stores/accountStore';
  import { useAccountService } from '../../services/accountService';

  import { AccountTypeUtils } from '../../utils/accountTypeUtils';

  const settingStore = useSettingStore();

  const accountStore = useAccountStore();
  const accountService = useAccountService();

  const router = useRouter();

  const props = defineProps({
    bookId: {
      type: Number,
      required: true
    },
    accountId: {
      type: Number,
      required: true
    },
    editable: {
      type: Boolean,
      default: true
    }
  });

  const account = computed(() => accountStore.getById(props.accountId));

  const name = ref('');
  const description = ref('');

  onMounted(() => {
    updateData();
  });

  function updateData(): void {
    name.value = account.value?.name ?? '';
    description.value = account.value?.description ?? '';
  }

  watch(account, () => {
    updateData();
  });

  const isInvertedAccount = computed(() => {
    return (
      !!account.value &&
      settingStore.useInvertedAccounts.value &&
      AccountTypeUtils.isInvertedAccount(account.value.type)
    );
  });

  async function handleCloseSidebar(): Promise<void> {
    await router.push({ name: 'account' });
  }

  async function handleDescriptionChanged(
    newDescription: string
  ): Promise<void> {
    description.value = newDescription;
    await handleAccountChanged();
  }

  async function handleAccountChanged(): Promise<void> {
    if (!account.value) return;

    account.value.description = description.value;

    await accountService.updateAccount(account.value);
  }
</script>
