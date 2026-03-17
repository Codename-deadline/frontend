<script setup lang="ts">
import { NCard, NTabs } from 'naive-ui';

defineProps<{
  title: string;
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <n-card :title="title" closable @close="emit('close')">
    <n-tabs justify-content="space-evenly">
      <slot />
    </n-tabs>
  </n-card>
</template>
