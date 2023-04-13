<template>
  <div>
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
          :value="balance"
          :animation="true"
          :inverted-value="isInvertedAccount"
        >
          <template
            #suffix
            v-if="isMonthlyAccount"
          >
            / {{ t('money', 'mo') }}
          </template>
        </CurrencyText>
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

    <div class="hidden max-h-[25vh] md:block md:h-80">
      <LineChart
        v-if="!isMonthlyAccount"
        :data="lineChartData"
      />

      <BarChart
        v-else
        :data="barChartData"
      />
    </div>

    <TransactionImportDialog
      v-if="showImportTransactionsDialog"
      @close="() => (showImportTransactionsDialog = false)"
      :account-id="account.id"
    />
  </div>
</template>

<script lang="ts">
  import dayjs from 'dayjs';

  import { defineComponent, type PropType } from 'vue';

  import { GraphDataUtils } from '../utils/graphDataUtils';
  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import { type Account, useAccountStore } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';

  import { useSettingStore } from '../stores/settingStore';

  import SeamlessInput from './SeamlessInput.vue';
  import CurrencyText from './CurrencyText.vue';
  import TransactionImportDialog from './TransactionImportDialog.vue';
  import LineChart, { type Data } from './charts/LineChart.vue';
  import BarChart, { type DataItem } from './charts/BarChart.vue';

  import NcActions from '@nextcloud/vue/dist/Components/NcActions';
  import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton';

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
        accountStore: useAccountStore(),
        accountService: useAccountService(),
        settingStore: useSettingStore(),
        showImportTransactionsDialog: false,
        AccountTypeUtils
      };
    },
    computed: {
      balance() {
        if (this.isMonthlyAccount) {
          const date = dayjs();
          return this.account.stats[date.year()]?.[date.month() + 1] ?? 0.0;
        } else {
          return this.account.balance;
        }
      },
      isMonthlyAccount() {
        return AccountTypeUtils.isMonthlyAccount(this.account.type);
      },
      isInvertedAccount() {
        return this.settingStore.useInvertedAccounts && AccountTypeUtils.isInvertedAccount(this.account.type);
      },
      lineChartData(): Data {
        const inversionFactor = this.isInvertedAccount ? -1 : 1;

        const data = GraphDataUtils.createLineGraphData({
          startValue: this.account.balance * inversionFactor,
          callback: (date) => {
            return this.accountStore.getSummary(
              this.account.id,
              date.year(),
              date.month() + 1
            ) * inversionFactor
          }
        })

        return {
          labels: data.map(d => d.label),
          datasets: [
            {
              values: data.map(d => d.value)
            }
          ]
        };
      },
      barChartData(): Array<DataItem> {
        return GraphDataUtils.createBarGraphData({
          callback: (date) => {
            const summary = this.accountStore.getSummary(
              this.account.id,
              date.year(),
              date.month() + 1
            );

            return this.isInvertedAccount ? summary * -1 : summary;
          }
        })
      }
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
      Upload,
      LineChart,
      BarChart
    }
  });
</script>
