<template>
  <NcModal
    size="large"
    @close="$emit('close')"
    :can-close="!isImporting"
  >
    <div class="p-8 [&>*]:my-6">
      <h1 class="text-center text-2xl">
        {{ t('money', 'Import Transactions') }}
      </h1>
      <div>
        <h2>
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
        <h2>
          {{ t('money', 'File Settings') }}
        </h2>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label> {{ t('money', 'Column Separator') }}: </label>
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
          <div>
            <label> {{ t('money', 'Decimal Separator') }}: </label>
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
          <div>
            <label> {{ t('money', 'Date Format') }}: </label>
            <input
              class="w-full"
              v-model="dateFormat"
              @change="handleDateFormatChanged"
            />
          </div>
        </div>
      </div>

      <div>
        <h2>
          {{ t('money', 'Column Selection') }}
        </h2>
        <div class="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div
            v-for="(column, key) in columns"
            :key="key"
            :class="{ 'text-red-500': !columnIsValid(column) }"
          >
            <div>{{ column.name }}</div>
            <div>
              <select
                class="w-full"
                :class="{
                  'border-red-500': !columnIsValid(column)
                }"
                v-model="column.selectedColumn"
                @change="handleColumnSelectionChanged(column)"
                :disabled="!availableColumns.length"
              >
                <option :value="null">
                  ( {{ t('money', 'Not selected') }} )
                </option>

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
                v-for="(dataItem, index) in column.parsedData.slice(0, 5)"
                :key="index"
                class="truncate"
              >
                {{ column.printValue?.(dataItem) ?? dataItem }} &nbsp;
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center">
        <NcButton
          class="shrink-0"
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
          {{ numberOfImportedTransactions }} /
          {{ numberOfTransactionsToImport }}
        </span>
      </div>
    </div>
  </NcModal>
</template>

<script setup lang="ts">
  import { parse } from 'csv-parse/browser/esm/sync';
  import dayjs from 'dayjs';

  import { translate as t } from '@nextcloud/l10n';

  import { computed, reactive, ref, type Ref } from 'vue';

  import { useSplitStore } from '../stores/splitStore';
  import { useTransactionService } from '../services/transactionService';
  import { useAccountStore } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';

  import { NcModal, NcButton, NcLoadingIcon } from '@nextcloud/vue';

  import FileInput from './FileInput.vue';

  import Upload from 'vue-material-design-icons/Upload.vue';

  import { NumberUtils } from '../utils/numberUtils';
  import { DateUtils } from '../utils/DateUtils';

  const transactionService = useTransactionService();
  const splitStore = useSplitStore();
  const accountStore = useAccountStore();
  const accountService = useAccountService();

  const props = defineProps({
    accountId: {
      type: Number,
      required: true
    }
  });

  const emit = defineEmits(['close', 'transactions-imported']);

  const isImporting = ref(false);

  const columns: Columns = reactive({
    date: {
      name: t('money', 'Date'),
      selectedColumn: null,
      required: true,
      parsedData: [],
      isValid: false,
      validator: (parsedData) => dayjs(parsedData).isValid(),
      parser: (line) =>
        DateUtils.getDateStringForTransaction(dayjs(line, dateFormat.value)),
      printValue: (value) => dayjs(value).format('L')
    },
    description: {
      name: t('money', 'Description'),
      selectedColumn: null,
      required: true,
      parsedData: [],
      isValid: true,
      parser: (line) => line
    },
    comment: {
      name: t('money', 'Comment'),
      selectedColumn: null,
      parsedData: [],
      isValid: true,
      parser: (line) => line
    },
    credit: {
      name: t('money', 'Credit'),
      selectedColumn: null,
      required: (columns) => !columns.debit.selectedColumn,
      parsedData: [],
      isValid: false,
      validator: (parsedData) => !Number.isNaN(parsedData),
      parser: (line) => NumberUtils.parseNumber(line, decimalSeparator.value)
    },
    debit: {
      name: t('money', 'Debit'),
      selectedColumn: null,
      required: (columns) => !columns.credit.selectedColumn,
      parsedData: [],
      isValid: false,
      validator: (parsedData) => !Number.isNaN(parsedData),
      parser: (line) => NumberUtils.parseNumber(line, decimalSeparator.value)
    }
  });
  const fileContent = ref('');
  const availableColumns: Ref<Array<string>> = ref([]);
  const parsedData: Ref<Array<Record<string, any>>> = ref([]);

  const numberOfImportedTransactions = ref(0);
  const numberOfTransactionsToImport = ref(0);

  const account = computed(() => {
    return accountStore.getById(props.accountId);
  });

  const columnSeparator = ref(
    account.value?.extraData.csvImport?.columnSeparator ?? ','
  );
  const decimalSeparator = ref(
    account.value?.extraData.csvImport?.decimalSeparator ?? '.'
  );
  const dateFormat = ref(
    account.value?.extraData.csvImport?.dateFormat ?? 'DD.MM.YYYY'
  );

  const isValid = computed(() => {
    return Object.values(columns).every((column) => columnIsValid(column));
  });

  function columnIsValid(column: Column<any>): boolean {
    const required =
      typeof column.required === 'function'
        ? column.required(columns)
        : column.required;

    if (!required) {
      return !column.selectedColumn || column.isValid;
    } else {
      return !!column.selectedColumn && column.isValid;
    }
  }

  async function handleFileChanged(file: File | null): Promise<void> {
    if (!file) throw new Error('cannot import transactions without a csv file');

    await readFile(file);
  }

  function handleColumnSeparatorChanged(): void {
    parseFile();
  }

  function handleDecimalSeparatorChanged(): void {
    parseFile();
  }

  function handleDateFormatChanged(): void {
    updateColumnParsedData();
    validate(columns.date);
  }

  function handleColumnSelectionChanged(column: Column<any>): void {
    updateColumnParsedData();
    validate(column);
  }

  function validate(column: Column<any>): void {
    if (!column.validator) return;

    if (column.parsedData.every(column.validator)) {
      column.isValid = true;
    } else {
      column.isValid = false;
    }
  }

  async function handleImportClick(): Promise<void> {
    if (
      !columns.date.selectedColumn ||
      !columns.description.selectedColumn ||
      (!columns.credit.selectedColumn && !columns.debit.selectedColumn)
    )
      throw new Error('cannot import without selected columns');

    await saveAccountSettings();

    const transactionsToImport = [];
    for (const index of parsedData.value.keys()) {
      const credit = columns.credit.parsedData[index] ?? 0.0;
      const debit = columns.debit.parsedData[index] ?? 0.0;

      const value =
        -(!Number.isNaN(credit) ? credit : 0.0) +
        (!Number.isNaN(debit) ? debit : 0.0);

      const date = columns.date.parsedData[index];
      if (!date) throw new Error('cannot import transaction without a date');

      const description = columns.description.parsedData[index];
      if (description === undefined)
        throw new Error('cannot import transaction without a description');

      const srcSplitComment = columns.comment.parsedData[index];

      const transactionToCreate = {
        date,
        description: description.slice(0, 1024),
        value,
        convertRate: 1.0,
        srcAccountId: props.accountId,
        srcSplitComment: srcSplitComment?.slice(0, 1024)
      };

      transactionsToImport.push(transactionToCreate);
    }

    let startDate = null;
    let endDate = null;

    for (const transaction of transactionsToImport) {
      if (!startDate || startDate > transaction.date)
        startDate = transaction.date;
      if (!endDate || endDate < transaction.date) endDate = transaction.date;
    }

    if (!startDate || !endDate)
      throw new Error('cannot import transactions without a start/end date');

    isImporting.value = true;

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
          (await splitStore.getByTransactionId(transaction.id))
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

    for (const transaction of transactionsToCreate) {
      await transactionService.addTransactionWithSplits(transaction, false);
      numberOfImportedTransactions.value++;
    }

    await transactionService.reloadTransactions();

    isImporting.value = false;

    numberOfTransactionsToImport.value = 0;
    numberOfImportedTransactions.value = 0;

    emit('close');
  }

  async function readFile(file: File): Promise<void> {
    fileContent.value = await new Promise((res, rej) => {
      const fileReader = new FileReader();

      fileReader.onload = (): void => {
        if (fileReader.result && typeof fileReader.result === 'string') {
          res(fileReader.result);
        } else {
          rej('no file reader result');
        }
      };

      fileReader.onerror = (error): void => {
        rej(error);
      };

      fileReader.readAsText(file);
    });

    parseFile();
  }

  function parseFile(): void {
    const records = parse(fileContent.value, {
      bom: true,
      columns: true,
      delimiter: columnSeparator.value,
      skipEmptyLines: true
    });

    availableColumns.value = Object.keys(records[0]);
    parsedData.value = records;

    selectMatchingColumns();
    updateColumnParsedData();
  }

  function selectMatchingColumns(): void {
    const savedColumnMapping =
      account.value?.extraData.csvImport?.columnMapping;

    for (const [columnName, columnInfo] of Object.entries(columns)) {
      const selectedColumn = columnInfo.selectedColumn;
      if (selectedColumn) continue;

      const savedColumnName = savedColumnMapping?.[columnName];
      if (savedColumnName) {
        columnInfo.selectedColumn = savedColumnName;
        handleColumnSelectionChanged(columnInfo);
      } else if (availableColumns.value.indexOf(columnInfo.name) >= 0) {
        columnInfo.selectedColumn = columnInfo.name;
        handleColumnSelectionChanged(columnInfo);
      }
    }
  }

  function updateColumnParsedData(): void {
    for (const column of Object.values(columns)) {
      const selectedColumn = column.selectedColumn;

      if (!selectedColumn) {
        column.parsedData = [];
      } else {
        column.parsedData = parsedData.value.map((line) =>
          column.parser(line[selectedColumn])
        );
      }
    }
  }

  function getHashOfTransaction(
    date: string,
    description: string,
    value: number
  ): string {
    return `${date}-${description}-${value}`;
  }

  async function saveAccountSettings(): Promise<void> {
    if (!account.value)
      throw new Error('cannot save column mapping without account');

    const newColumnMapping: Record<string, string> = {};

    for (const [columnName, columnInfo] of Object.entries(columns)) {
      if (columnInfo.selectedColumn)
        newColumnMapping[columnName] = columnInfo.selectedColumn;
    }

    await accountService.updateAccount({
      ...account.value,
      extraData: {
        ...account.value.extraData,
        csvImport: {
          ...account.value.extraData.csvImport,
          columnSeparator: columnSeparator.value,
          decimalSeparator: decimalSeparator.value,
          dateFormat: dateFormat.value,
          columnMapping: newColumnMapping
        }
      }
    });
  }

  type Columns = {
    date: Column<string>;
    description: Column<string>;
    comment: Column<string>;
    credit: Column<number>;
    debit: Column<number>;
  };

  type Column<T> = {
    name: string;
    selectedColumn: string | null;
    required?: boolean | ((columns: Columns) => boolean);
    parsedData: Array<T>;
    isValid: boolean;
    validator?: (parsedData: T) => boolean;
    parser: (line: string) => T;
    printValue?: (value: T) => string;
  };
</script>
