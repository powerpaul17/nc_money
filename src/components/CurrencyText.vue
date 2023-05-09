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

<script setup lang="ts">
  import { computed, ref, watch, type Ref } from 'vue';

  import { useSettingStore } from '../stores/settingStore';

  import { NumberUtils } from '../utils/numberUtils';

  const settingStore = useSettingStore();

  const props = defineProps({
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
  });

  const animationClass: Ref<string|null> = ref(null);
  const shownValue = ref(props.value);

  watch(() => props.value, (newValue, oldValue) => {
    if (!props.animation) {
      shownValue.value = newValue;
      return;
    }

    if (newValue < oldValue !== props.invertedValue) {
      animationClass.value = 'change-down';
    } else {
      animationClass.value = 'change-up';
    }

    setTimeout(() => {
      animationClass.value = null;
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

      shownValue.value = oldValue + changePerMillisecond * elapsed;

      if (
        (difference > 0 && shownValue.value < newValue) ||
        (difference < 0 && shownValue.value > newValue)
      ) {
        window.requestAnimationFrame(callback);
      } else {
        shownValue.value = newValue;
      }
    };

    window.requestAnimationFrame(callback);
  });

  const formattedValue = computed(() => {
    return NumberUtils.formatNumber(shownValue.value, {
      decimals: settingStore.numberFormat_decimals,
      decimalSeparator: settingStore.numberFormat_decimalSeparator,
      groupBy: settingStore.numberFormat_groupBy,
      groupSeparator: settingStore.numberFormat_groupSeparator,
      invertedValue: props.invertedValue
    });
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
