<script setup lang="ts">
import { NButton } from "naive-ui";
import type { Component } from "vue";
import type { AuthMethod } from "@/types/api";

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
  <n-button @click="_updateMethod" type="info" size="large">
    <template #icon>
      <Icon>
        <component :is="icon" />
      </Icon>
    </template>
    <span class="capitalize">{{ method.valueOf().toLowerCase() }}</span>
  </n-button>
</template>
