<script setup lang="ts">
import { NDatePicker } from 'naive-ui';

defineProps<{
  disabled?: boolean
}>()
const model = defineModel<number>("value");

const ONE_MINUTE: number = 60 * 1000;
const ONE_HOUR: number = 60 * ONE_MINUTE;
const ONE_DAY: number = 24 * ONE_HOUR;
// TODO: Receive from api
const MIN_DEADLINE_DURATION: number = 15 * ONE_MINUTE;

const now = Date.now();
function dateDisabled(ts: number) {
  return ts + ONE_DAY < now;
}

const dueDateFilter = (ts: number) => {
  const time: Date = new Date(ts);
  time.setHours(0, 0, 0, 0);
  const dayStartMS: number = time.getTime();

  const minAllowedDate: number = Date.now() + MIN_DEADLINE_DURATION;

  return {
    isHourDisabled: (hour: number) => {
      return dayStartMS + (hour + 1) * ONE_HOUR < minAllowedDate;
    },
    isMinuteDisabled: (minute: number, hour: number | null) => {
      if (hour === null) return false;
      return dayStartMS + (minute + hour * 60) * ONE_MINUTE < minAllowedDate;
    }
  }
}
</script>

<template>
  <n-date-picker
    v-model:value="model"
    :disabled="disabled"
    type="datetime"
    :is-date-disabled="dateDisabled"
    :is-time-disabled="dueDateFilter"
  />
</template>
