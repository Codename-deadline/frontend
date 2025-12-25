<script setup lang="ts">
import { NButton } from "naive-ui";
import type { Component } from "vue";
import type { AuthMethod } from "@/types/AuthMethod";

const props = defineProps<{
  method: AuthMethod;
  icon: Component;
}>();

const model = defineModel<AuthMethod>();

const _updateMethod = () => {
  model.value = props.method;
};
</script>

<template>
  <n-button @click="_updateMethod" class="w-1/2!" type="info" size="large">
    <template #icon>
      <n-icon>
        <component :is="icon" />
      </n-icon>
    </template>
    Telegram
  </n-button>
</template>
