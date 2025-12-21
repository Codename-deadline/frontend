<template>
    <n-config-provider :theme="_theme" :locale="_locale">
        <n-global-style />
        <RouterView />
    </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme, lightTheme, ruRU, useOsTheme } from "naive-ui";
import { computed } from "vue";

const osTheme = useOsTheme();
const _theme = computed(() => (osTheme.value === "dark" ? darkTheme : lightTheme));

const _locale = computed(() => ruRU);
</script>
