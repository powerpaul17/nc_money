<template>
  <div class="-mr-3 flex items-center p-5 [&>*]:mr-3">
    <div class="flex flex-auto flex-col">
      <div>
        <SeamlessInput
          class="text-lg"
          :placeholder="t('money', 'Name')"
          :value="account.name"
          @value-changed="handleAccountNameModified"
        />
      </div>
      <div>
        <SeamlessInput
          :placeholder="t('money', 'Description')"
          :value="account.description"
          @value-changed="handleAccountDescriptionModified"
        />
      </div>
    </div>
    <div class="flex shrink-0 grow-0 items-center text-right text-xl">
      <CurrencyText
        :value="account.balance"
        :animation="true"
      />
    </div>
    <div class="grow-0">
      <NcActions>
        <NcActionButton @click="() => (showImportTransactionsDialog = true)">
          <template #icon>
            <Upload :size="20" />
          </template>
          {{ t('money', 'Import transactions') }}
        </NcActionButton>
      </NcActions>
    </div>
  </div>

  <TransactionImportDialog
    v-if="showImportTransactionsDialog"
    @close="() => (showImportTransactionsDialog = false)"
    :account-id="account.id"
  />
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import { useAccountService } from '../services/accountService';

  import SeamlessInput from './SeamlessInput.vue';
  import CurrencyText from './CurrencyText.vue';
  import TransactionImportDialog from './TransactionImportDialog.vue';

  import NcActions from '@nextcloud-vue/components/NcActions';
  import NcActionButton from '@nextcloud-vue/components/NcActionButton';

  import Upload from 'vue-material-design-icons/Upload.vue';

  export default defineComponent({
    props: {
      account: {
        type: Object as PropType<Account>,
        required: true
      }
    },
    data() {
      return {
        accountService: useAccountService(),
        showImportTransactionsDialog: false
      };
    },
    methods: {
      handleAccountNameModified(newName: string) {
        this.account.name = newName;
        this.handleAccountModified();
      },
      handleAccountDescriptionModified(newDescription: string) {
        this.account.description = newDescription;
        this.handleAccountModified();
      },
      handleAccountModified() {
        this.accountService.updateAccount(this.account);
      }
    },
    components: {
      SeamlessInput,
      CurrencyText,
      TransactionImportDialog,
      NcActions,
      NcActionButton,
      Upload
    }
  });
</script>
