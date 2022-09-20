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

  import { Utils } from '../utils/utils';

  export default defineComponent({
    props: {
      value: {
        type: Number,
        required: true
      },
      animation: {
        type: Boolean,
        default: false
      },
      decimals: {
        type: Number,
        default: 2
      },
      decimalSeparator: {
        type: String,
        default: '.'
      },
      groupBy: {
        type: Number,
        default: 3
      },
      groupSeparator: {
        type: String,
        default: ' '
      },
      invertedValue: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        animationClass: null as String | null,
        shownValue: this.value
      };
    },
    watch: {
      value(newValue, oldValue) {
        if (!this.animation) {
          this.shownValue = newValue;
          return;
        }

        if (newValue < oldValue) {
          this.animationClass = 'change-down';
        } else if (newValue > oldValue) {
          this.animationClass = 'change-up';
        }

        setTimeout(() => {
          this.animationClass = null;
        }, 300);

        const difference = newValue - oldValue;
        const duration = 500;
        const changePerMillisecond = difference / duration;

        let startTimestamp: number | undefined;

        const callback: FrameRequestCallback = (timestamp) => {
          if (startTimestamp == undefined) {
            startTimestamp = timestamp;
          }
          const elapsed = timestamp - startTimestamp;

          this.shownValue = oldValue + changePerMillisecond * elapsed;

          if (
            (difference > 0 && this.shownValue < newValue) ||
            (difference < 0 && this.shownValue > newValue)
          ) {
            window.requestAnimationFrame(callback);
          } else {
            this.shownValue = newValue;
          }
        };

        window.requestAnimationFrame(callback);
      }
    },
    computed: {
      formattedValue() {
        const negativeValue = this.shownValue < 0;
        const numberString = Math.abs(this.shownValue).toFixed(this.decimals);

        const decimalSplitParts = numberString.split('.');
        const beforeDecimal = decimalSplitParts[0];
        if (!beforeDecimal) throw new Error('invalid number');

        const decimals = decimalSplitParts[1];

        const groupedBeforeDecimal = Utils.chunk(
          Array.from(beforeDecimal).reverse(),
          this.groupBy
        )
          .reverse()
          .map((a) => a.reverse().join(''))
          .join(this.groupSeparator);

        return `${
          negativeValue != this.invertedValue ? '-' : ''
        }${groupedBeforeDecimal}${
          decimals ? `${this.decimalSeparator}${decimals}` : ''
        }`;
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
