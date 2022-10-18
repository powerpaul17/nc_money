<template>
  <SeamlessInput
    :value="dateValue"
    :placeholder="placeholder"
    @value-changed="handleDateValueChanged"
  />
</template>

<script lang="ts">
  import dayjs from 'dayjs';

  import { defineComponent } from 'vue';

  import SeamlessInput from './SeamlessInput.vue';

  export default defineComponent({
    props: {
      date: {
        type: Date,
        required: true
      },
      placeholder: {
        type: String,
        default: ''
      }
    },
    emits: [ 'date-changed' ],
    data() {
      return {
        dateValue: ''
      };
    },
    watch: {
      formattedDate() {
        this.dateValue = this.formattedDate;
      }
    },
    computed: {
      formattedDate() {
        return dayjs(this.date).format('L');
      }
    },
    methods: {
      handleDateValueChanged(newDateValue: string) {
        this.dateValue = this.formattedDate;

        const newDate = dayjs(newDateValue, 'L').toDate();
        if (!Number.isNaN(newDate.valueOf())) {
          this.$emit('date-changed', newDate);
        }
      }
    },
    mounted() {
      this.dateValue = this.formattedDate;
    },
    components: { SeamlessInput }
  });
</script>
