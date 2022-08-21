<template>
  <span
    class="bg-inherit text-inherit text-right transition-all duration-300 ease-in-out"
    :class="animationClass"
  >
    {{ formattedValue }}
  </span>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      value: {
        type: Number,
        required: true
      },
      animation: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        animationClass: null as String | null
      };
    },
    watch: {
      value(newValue, oldValue) {
        if (!this.animation) return;

        if (newValue < oldValue) {
          this.animationClass = 'change-down';
        } else if (newValue > oldValue) {
          this.animationClass = 'change-up';
        }

        setTimeout(() => {
          this.animationClass = null;
        }, 300);
      }
    },
    computed: {
      formattedValue() {
        return this.value.toFixed(2);
      }
    }
  });
</script>

<style>
  .change-up {
    font-size: 110% !important;
    color: lightgreen !important;
  }

  .change-down {
    font-size: 90% !important;
    color: red !important;
  }
</style>
