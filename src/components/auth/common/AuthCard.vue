<script setup lang="ts">
import { ArrowLeft, CalendarAlt } from "@vicons/fa";
import { NButton, NCard } from "naive-ui";
import { useI18n } from "vue-i18n";
import { APP_NAME } from "@/constants/app";

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    headerSelector?: string;
    descriptionSelector?: string;
    showBackButton?: boolean;
  }>(),
  {
    headerSelector: "",
    descriptionSelector: "",
    showBackButton: false,
  },
);

const emit = defineEmits<(e: "back") => void>();
</script>

<template>
  <n-card class="max-w-1/2 max-sm:max-w-4/5 rounded-xl! shadow-lg! p-4! border!">
    <header class="flex flex-col items-center justify-center space-y-4">
      <div class="w-full" v-if="showBackButton">
        <n-button text @click="emit('back')">
          <template #icon>
            <Icon>
              <ArrowLeft/>
            </Icon>
          </template>
          {{ t("actions.back") }}
        </n-button>
      </div>
      <Icon size="48" class="mb-0!">
        <CalendarAlt/>
      </Icon>
      <div class="flex flex-col items-center justify-center space-y-4">
        <h1 class="mb-0 max-sm:text-3xl">
          {{ headerSelector ? t(headerSelector) : APP_NAME }}
        </h1>
        <div v-if="descriptionSelector" class="text-center text-gray-500">
          {{ t(descriptionSelector) }}
        </div>
      </div>
    </header>
    <section class="card__body mt-6">
      <slot name="body"></slot>
    </section>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </n-card>
</template>
