<script setup lang="ts">
import { darkTheme, lightTheme, NConfigProvider, NGlobalStyle, ruRU, useOsTheme } from "naive-ui";
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
    router.push("/auth");
  }
}
</script>

<template>
    <n-config-provider :theme="_theme" :locale="_locale">
        <n-global-style />
        <RouterView />
    </n-config-provider>
</template>
