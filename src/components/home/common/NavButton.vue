<script setup lang="ts">
import { useThemeVars } from "naive-ui";
import type { Component } from "vue";
import { useI18n } from "vue-i18n";
import type { MainSection } from "@/types/navigation";

const props = defineProps<{
  section: MainSection;
  textSelector: string;
  icon: Component;
  isActive: boolean;
}>();

const emit = defineEmits<(e: "click", id: MainSection) => void>();

const { t } = useI18n();
const themeVars = useThemeVars();
</script>

<template>
  <button
    @click="emit('click', section)"
    class="rounded-lg ease-out duration-200 nav-button hover:cursor-pointer p-2"
    :class="{ 'nav-button__active': isActive }"
  >
    <div class="flex flex-col items-center space-y-0.5">
      <Icon size="20">
        <component :is="icon"/>
      </Icon>
      <span class="capitalize">{{ t(textSelector) }}</span>
    </div>
  </button>
</template>

<style scoped>
.nav-button__active {
  background-color: v-bind("themeVars.infoColorPressed");
  color: v-bind("themeVars.baseColor");
}

.nav-button:hover {
  background-color: v-bind("themeVars.infoColorHover");
  color: v-bind("themeVars.baseColor");
}
</style>
