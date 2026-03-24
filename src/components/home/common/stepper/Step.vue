<script setup lang="ts">
import type { StepperStep } from '@/types/stepper';

// Title is fetched by the parent `Stepper` component
defineProps<{
  title: string;
  value: StepperStep
  nextStep?: () => void
  prevStep?: () => void
  changeStep?: (value: StepperStep) => void
  isFirstStep?: boolean
  isLastStep?: boolean
}>()
</script>

<template>
  <slot
    :nextStep="nextStep"
    :prevStep="prevStep"
    :changeStep="changeStep"
    :isFirstStep="isFirstStep"
    :isLastStep="isLastStep"
  />
</template>
