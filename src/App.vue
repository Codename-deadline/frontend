<script setup lang="ts">
import {
  darkTheme,
  enUS,
  type GlobalThemeOverrides,
  NConfigProvider,
  NGlobalStyle,
  NNotificationProvider,
  ruRU,
  useOsTheme,
} from "naive-ui";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import GlobalEventHandler from "./GlobalEventHandler.vue";
import { useTokenStore } from "./stores/TokenStore";
import { useUserStore } from "./stores/UserStore";
import { Language } from "./types/Language";

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

const userStore = useUserStore();
const { locale } = useI18n();
const _currentLocale = ref(enUS);
watch(
  () => userStore.user?.language,
  (newLanguage: Language | undefined) => {
    if (!newLanguage) return;
    locale.value = newLanguage.valueOf().toLowerCase();

    switch (newLanguage) {
      case Language.ENGLISH:
        _currentLocale.value = enUS;
        break;
      case Language.RUSSIAN:
        _currentLocale.value = ruRU;
        break;
    }
  },
);

const tokenStore = useTokenStore();
tokenStore.initialize();
</script>

<template>
  <n-config-provider :theme="_theme" :theme-overrides="_themeOverrides" :locale="_currentLocale">
    <n-global-style/>
    <n-notification-provider :max="3">
      <RouterView/>
      <GlobalEventHandler />
    </n-notification-provider>
  </n-config-provider>
</template>
