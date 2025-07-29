<template>
  <label class="flex flex-col items-baseline">
    {{ label }}
    <NcDateTimePicker
      class="date-input w-full"
      v-model="dateValue"
      :append-to-body="true"
      :placeholder="placeholder"
      :formatter="formatter"
      :disabled="!editable"
    />
  </label>
</template>

<style>
  .date-input.mx-datepicker .mx-input-wrapper .mx-input {
    background: transparent !important;
    border: 2px solid transparent !important;
    box-shadow: none;
  }

  .date-input.mx-datepicker:not(.disabled) .mx-input-wrapper .mx-input:hover,
  .date-input.mx-datepicker .mx-input-wrapper .mx-input:focus {
    border-color: var(--color-primary-element) !important;
  }
</style>

<script setup lang="ts">
  import dayjs from 'dayjs';

  import { computed } from 'vue';

  import { NcDateTimePicker } from '@nextcloud/vue';

  const props = defineProps({
    date: {
      type: Date,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: true
    }
  });

  const emit = defineEmits<{
    (event: 'date-changed', newDate: Date): void;
  }>();

  const dateValue = computed({
    get() {
      return props.date;
    },
    set(newDateValue) {
      emit('date-changed', newDateValue);
    }
  });

  const formatter = {
    stringify: (date: Date): string => dayjs(date).format('L'),
    parse: (value: string): Date => getDateFromValue(value)
  };

  function getDateFromValue(value: string): Date {
    const date =
      ['L', 'D', 'DD']
        .map((f) => dayjs(value, f))
        .find((djs) => djs.isValid()) ?? dayjs();

    return date.toDate();
  }
</script>
