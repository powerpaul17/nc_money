<template>
  <SeamlessInput
    :value="dateValue"
    :placeholder="placeholder"
    @value-changed="handleDateValueChanged"
  />
</template>

<script setup lang="ts">

  import dayjs from 'dayjs';

  import { computed, onMounted, ref, watch } from 'vue';

  import SeamlessInput from './SeamlessInput.vue';

  const props = defineProps({
    date: {
      type: Date,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    }
  });

  const emit = defineEmits(['date-changed'])

  const dateValue = ref('');

  const formattedDate = computed(() => {
    return dayjs(props.date).format('L');
  });

  watch(formattedDate, () => {
    dateValue.value = formattedDate.value;
  })

  function handleDateValueChanged(newDateValue: string) {
    dateValue.value = formattedDate.value;

    const newDate = dayjs(newDateValue, 'L').toDate();
    if (!Number.isNaN(newDate.valueOf())) {
      emit('date-changed', newDate);
    }
  }

  onMounted(() => {
    dateValue.value = formattedDate.value;
  });

</script>
