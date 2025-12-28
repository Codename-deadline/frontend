<script setup lang="ts">
import {
  darkTheme,
  type GlobalThemeOverrides,
  NConfigProvider,
  NGlobalStyle,
  NNotificationProvider,
  ruRU,
  useOsTheme,
} from "naive-ui";
import { computed } from "vue";

const themeOverridesLight: GlobalThemeOverrides = {
  common: {
    bodyColor: "#F4F8FD",
  },
};

const darkThemeOverrides: GlobalThemeOverrides = {};

const osTheme = useOsTheme();

const isDark = computed(() => osTheme.value === "dark");
const _theme = computed(() => (isDark.value ? darkTheme : null));
const _themeOverrides = computed(() => (isDark.value ? darkThemeOverrides : themeOverridesLight));
const _locale = computed(() => ruRU);
</script>

<template>
    <n-config-provider :theme="_theme" :theme-overrides="_themeOverrides" :locale="_locale">
      <n-global-style />  
      <n-notification-provider :max="3">
        <RouterView />
      </n-notification-provider>
    </n-config-provider>
</template>
