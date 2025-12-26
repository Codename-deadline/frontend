<script setup lang="ts">
import {
  darkTheme,
  lightTheme,
  NConfigProvider,
  NGlobalStyle,
  NNotificationProvider,
  ruRU,
  useOsTheme,
} from "naive-ui";
import { computed } from "vue";
import { useRouter } from "vue-router";

const env = import.meta.env;

const osTheme = useOsTheme();
const _theme = computed(() => (osTheme.value === "dark" ? darkTheme : lightTheme));

const _locale = computed(() => ruRU);

const router = useRouter();
if (!localStorage.getItem("accessToken")) {
  if (!env.VITE_NO_AUTH_REDIRECT) {
    console.warn("Auth redirect disabled");
  } else {
    router.push({ path: "/auth" });
  }
}
</script>

<template>
    <n-config-provider :theme="_theme" :locale="_locale">
      <n-global-style />  
      <n-notification-provider :max="5">
        <RouterView />
      </n-notification-provider>
    </n-config-provider>
</template>
