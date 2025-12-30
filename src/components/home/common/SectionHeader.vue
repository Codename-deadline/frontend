<script setup lang="ts">
import { Plus } from "@vicons/fa";
import { Icon } from "@vicons/utils";
import { NButton } from "naive-ui";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  headerSelector: string;
  descriptionSelector: string;
  buttonSelector: string;
}>();

const { t } = useI18n();
</script>

<template>
  <header class="flex w-full justify-between items-center">
    <div>
      <h2>{{ t(headerSelector) }}</h2>
      <div class="description">{{ t(descriptionSelector) }}</div>
    </div>
    <div>
      <n-button type="info" class="rounded-lg!">
        <template #icon>
        <Icon>
          <Plus/>
        </Icon>
        </template>
        {{ t(buttonSelector) }}
      </n-button>
    </div>
  </header>
</template>
