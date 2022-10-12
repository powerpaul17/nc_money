<template>
  <NcModal
    size="large"
    @close="$emit('close')"
    :can-close="!isImporting"
  >
    <div class="p-8 [&>*]:my-5">
      <h1
        class="text-center text-2xl"
      >
        {{ t('money', 'Import Transactions') }}
      </h1>
      <div>
        <h2 class="mb-3 text-lg">
          {{ t('money', 'Select File') }}
        </h2>
        <div>
          <FileInput
            accept="text/csv"
            @file-changed="handleFileChanged"
          >
            {{ t('money', 'Click or drop CSV file') }}
          </FileInput>
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-lg">
          {{ t('money', 'File Settings') }}
        </h2>
        <div class="mb-3 -mr-3 flex">
          <div class="basis-1/3 pr-3">
            <label>
              {{ t('money', 'Column Separator') }}:
            </label>
            <select
              class="w-full"
              v-model="columnSeparator"
              @change="handleColumnSeparatorChanged"
            >
              <option
                v-for="separator in [',', ';', '\t']"
                :key="separator"
                :value="separator"
              >
                {{ separator }}
              </option>
            </select>
          </div>
          <div class="basis-1/3 pr-3">
            <label>
              {{ t('money', 'Decimal Separator') }}:
            </label>
            <select
              class="w-full"
              v-model="decimalSeparator"
              @change="handleDecimalSeparatorChanged"
            >
              <option
                v-for="separator in ['.', ',']"
                :key="separator"
                :value="separator"
              >
                {{ separator }}
              </option>
            </select>
          </div>
          <div class="basis-1/3 pr-3">
            <label>
              {{ t('money', 'Date Format') }}:
            </label>
            <input
              class="w-full"
              v-model="dateFormat"
              @change="handleDateFormatChanged"
            >
          </div>
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-lg">
          {{ t('money', 'Column Selection') }}
        </h2>
        <div class="mb-3 flex flex-wrap md:-mr-3">
          <div
            v-for="(column, key) in columns"
            :key="key"
            class="basis-full md:basis-1/2 md:pr-3 lg:basis-1/4"
            :class="{ 'text-red-500': column.selectedColumn && !column.isValid }"
          >
            <div>{{ column.name }}</div>
            <div>
              <select
                class="w-full"
                :class="{
                  'border-red-500': column.selectedColumn && !column.isValid
                }"
                v-model="column.selectedColumn"
                @change="handleColumnSelectionChanged(column)"
                :disabled="!availableColumns.length"
              >
                <option
                  v-for="availableColumn of availableColumns"
                  :key="availableColumn"
                >
                  {{ availableColumn }}
                </option>
              </select>
            </div>
            <div>
              <div
                v-for="(line, index) in column.lines.slice(0, 5)"
                :key="index"
                class="overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {{ line }} &nbsp;
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center">
        <NcButton
          type="primary"
          :disabled="isImporting || !isValid"
          @click="handleImportClick"
        >
          <template #icon>
            <NcLoadingIcon v-if="isImporting" />
            <Upload v-else />
          </template>
          {{ t('money', 'Import') }}
        </NcButton>

        <progress
          class="ml-3"
          :value="numberOfImportedTransactions"
          :max="numberOfTransactionsToImport"
        />

        <span class="ml-3 whitespace-nowrap">
          {{ numberOfImportedTransactions }} / {{ numberOfTransactionsToImport }}
        </span>
      </div>
    </div>
  </NcModal>
</template>

<script setup lang="ts">
  import { parse } from 'csv-parse/browser/esm/sync';
  import dayjs from 'dayjs';

  import {translate as t} from '@nextcloud/l10n';

  import { computed, reactive, ref, type Ref } from 'vue';

  import { useSplitStore } from '../stores/splitStore';
  import { useTransactionService } from '../services/transactionService';

  import NcModal from '@nextcloud-vue/components/NcModal';
  import NcButton from '@nextcloud-vue/components/NcButton';
  import NcLoadingIcon from '@nextcloud-vue/components/NcLoadingIcon';
  import FileInput from './FileInput.vue';

  import Upload from 'vue-material-design-icons/Upload.vue';
  import { Utils } from '../utils/utils';

  const transactionService = useTransactionService();
  const splitStore = useSplitStore();

  const props = defineProps({
    accountId: {
      type: Number,
      required: true
    }
  });

  const emit = defineEmits(['close', 'transactions-imported']);

  const isImporting = ref(false);
  const columnSeparator = ref(',');
  const decimalSeparator = ref('.');
  const dateFormat = ref('DD.MM.YYYY');
  const columns: Record<'date'|'description'|'comment'|'value', Column> = reactive({
    date: {
      name: t('money', 'Date'),
      selectedColumn: null,
      lines: [],
      isValid: false,
      validator: (line) => {
        return (
          dayjs(line, dateFormat.value).format(dateFormat.value) === line
        );
      }
    },
    description: {
      name: t('money', 'Description'),
      selectedColumn: null,
      lines: [],
      isValid: false,
      validator: () => true
    },
    comment: {
      name: t('money', 'Comment'),
      selectedColumn: null,
      lines: [],
      isValid: false,
      validator: () => true
    },
    value: {
      name: t('money', 'Value'),
      selectedColumn: null,
      lines: [],
      isValid: false,
      validator: (line) => {
        return !Number.isNaN(Utils.parseNumber(line, decimalSeparator.value));
      }
    }
  });
  const fileContent = ref('');
  const availableColumns: Ref<Array<string>> = ref([]);
  const parsedData: Ref<Array<Record<string, any>>> = ref([]);

  const numberOfImportedTransactions = ref(0);
  const numberOfTransactionsToImport = ref(0);

  const isValid = computed(() => {
    return (
      columns.comment.isValid &&
      columns.date.isValid &&
      columns.description.isValid &&
      columns.value.isValid
    );
  });

  function handleFileChanged(file: File | null) {
    if (!file)
      throw new Error('cannot import transactions without a csv file');

    readFile(file);
  }

  function handleColumnSeparatorChanged() {
    parseFile();
  }

  function handleDecimalSeparatorChanged() {
    parseFile();
  }

  function handleDateFormatChanged() {
    validate(columns.date);
  }

  function handleColumnSelectionChanged(column: Column) {
    updatePreviewLines();
    validate(column);
  }

  function validate(column: Column) {
    if (column.lines.every(column.validator)) {
      column.isValid = true;
    } else {
      column.isValid = false;
    }
  }

  async function handleImportClick() {
    if (
      !columns.date.selectedColumn ||
      !columns.description.selectedColumn ||
      !columns.value.selectedColumn ||
      !columns.comment.selectedColumn
    )
      throw new Error('cannot import without selected columns');

    const transactionsToImport = [];
    for (const dataItem of parsedData.value) {
      const transactionToCreate = {
        date: dayjs(
          dataItem[columns.date.selectedColumn],
          dateFormat.value
        ).toDate(),
        description: dataItem[columns.description.selectedColumn],

        // TODO convert before
        value: -Number(dataItem[columns.value.selectedColumn]),

        convertRate: 1.0,
        srcAccountId: props.accountId,
        srcSplitComment: dataItem[columns.comment.selectedColumn]
      };

      transactionsToImport.push(transactionToCreate);
    }

    let startDate = null;
    let endDate = null;

    for (const transaction of transactionsToImport) {
      if (!startDate || startDate > transaction.date)
        startDate = transaction.date;
      if (!endDate || endDate < transaction.date)
        endDate = transaction.date;
    }

    if (!startDate || !endDate)
      throw new Error('cannot import transactions without a start/end date');

    const existingTransactions =
      await transactionService.fetchTransactionsOfAccountByDate(
        props.accountId,
        startDate,
        endDate
      );

    const transactionHashMap = new Set();
    for (const transaction of existingTransactions) {
      transactionHashMap.add(
        getHashOfTransaction(
          transaction.date,
          transaction.description,
          splitStore
            .getByTransactionId(transaction.id)
            .filter((s) => s.destAccountId === props.accountId)
            .shift()?.value ?? 0
        )
      );
    }

    const transactionsToCreate = transactionsToImport.filter(
      (t) =>
        !transactionHashMap.has(
          getHashOfTransaction(t.date, t.description, -t.value)
        )
    );

    numberOfTransactionsToImport.value = transactionsToCreate.length;
    numberOfImportedTransactions.value = 0;

    isImporting.value = true;

    for(const transaction of transactionsToCreate)  {
      await transactionService.addTransactionWithSplits(
        transaction,
        false
      );
      numberOfImportedTransactions.value++;
    }

    await transactionService.reloadTransactions();

    isImporting.value = false;

    numberOfTransactionsToImport.value = 0;
    numberOfImportedTransactions.value = 0;

    emit('close');
  }

  async function readFile(file: File) {
    fileContent.value = await new Promise((res, rej) => {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        if (fileReader.result && typeof fileReader.result === 'string') {
          res(fileReader.result);
        } else {
          rej('no file reader result');
        }
      };

      fileReader.onerror = (error) => {
        rej(error);
      };

      fileReader.readAsText(file);
    });
    parseFile();
  }

  function parseFile() {
    const records = parse(fileContent.value, {
      bom: true,
      columns: true,
      delimiter: columnSeparator.value,
      skipEmptyLines: true
    });
    console.warn(records);

    availableColumns.value = Object.keys(records[0]);
    parsedData.value = records;

    updatePreviewLines();
  }

  function updatePreviewLines() {
    for (const column of Object.values(columns)) {
      const selectedColumn = column.selectedColumn;

      if (!selectedColumn) {
        column.lines = [];
      } else {
        column.lines = parsedData.value.map((line) => {
          return line[selectedColumn];
        });
      }
    }
  }

  function getHashOfTransaction(date: Date, description: string, value: number) {
    return `${dayjs(date).format('YYYY-MM-DD')}-${description}-${value}`;
  }

  type Column = {
    name: string;
    selectedColumn: string | null;
    lines: Array<string>;
    isValid: boolean;
    validator: (line: string) => boolean;
  };
</script>
