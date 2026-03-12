<script setup lang="ts">
import { Plus } from "@vicons/fa";
import { Icon } from "@vicons/utils";
import { NButton } from "naive-ui";
import { useI18n } from "vue-i18n";
import { tScopePrefix } from "@/locales/utils";
import type { ScopeType } from "@/types/ScopeType";

const props = defineProps<{
  scope: ScopeType;
  buttonAction: string;
}>();

const { t } = useI18n();
</script>

<template>
  <header class="flex w-full justify-between items-center">
    <div>
      <h2>{{ t(tScopePrefix(scope, "header")) }}</h2>
      <div class="description">{{ t(tScopePrefix(scope, "description")) }}</div>
    </div>
    <div>
      <n-button type="info" class="rounded-lg!">
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
