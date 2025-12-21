<script setup lang="ts">
import { useI18n } from "vue-i18n";

// biome-ignore lint/correctness/noUnusedVariables: Biome does not yet check <template>
const { t } = useI18n();
</script>

<template>
    <h1 class="">Hello world!</h1>
    <n-space>
        <n-button>{{ t("test") }}</n-button>
    </n-space>
</template>
