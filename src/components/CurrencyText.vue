<template>
  <div class="flex items-baseline">
    <span
      class="
        grow
        bg-inherit
        text-right
        text-inherit
        transition-all duration-300 ease-in-out
      "
      :class="animationClass"
    >{{ formattedValue }}</span>
    <span class="ml-2 shrink-0 text-xs">
      <slot name="suffix" />
    </span>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useSettingStore } from '../stores/settingStore';

  import { NumberUtils } from '../utils/numberUtils';

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
      invertedValue: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        animationClass: null as string | null,
        shownValue: this.value
      };
    },
    watch: {
      value(newValue, oldValue) {
        if (!this.animation) {
          this.shownValue = newValue;
          return;
        }

        if (newValue < oldValue !== this.invertedValue) {
          this.animationClass = 'change-down';
        } else {
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
        return NumberUtils.formatNumber(this.shownValue, {
          decimals: this.settingStore.numberFormat_decimals,
          decimalSeparator: this.settingStore.numberFormat_decimalSeparator,
          groupBy: this.settingStore.numberFormat_groupBy,
          groupSeparator: this.settingStore.numberFormat_groupSeparator,
          invertedValue: this.invertedValue
        });
      }
    },
    setup() {
      return {
        settingStore: useSettingStore()
      };
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
