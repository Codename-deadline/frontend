<script setup lang="ts">
import { Plus } from "@vicons/fa";
import { Icon } from "@vicons/utils";
import { NButton } from "naive-ui";
import { useI18n } from "vue-i18n";
import emitter from "@/plugins/emitter";
import type { ScopeType } from "@/types/scope";

const props = defineProps<{
  scopeType: ScopeType;
  buttonAction: string;
}>();

const { t } = useI18n();
</script>

<template>
  <header class="flex w-full justify-between items-center">
    <div>
      <h2>{{ t(`scopes.${scopeType}.header`) }}</h2>
      <div class="description">{{ t(`scopes.${scopeType}.description`) }}</div>
    </div>
    <div>
      <n-button @click="emitter.emit('openCreateEntityDialog')" type="info" class="rounded-lg!">
        <template #icon>
        <Icon>
          <Plus/>
        </Icon>
        </template>
        {{ t(`actions.${buttonAction}`) }}
      </n-button>
    </div>
  </header>
</template>
