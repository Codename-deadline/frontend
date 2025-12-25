<script setup lang="ts">
import { Telegram as TelegramIcon } from "@vicons/fa";
import { NButton, NCard } from "naive-ui";
import { type Component, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { APP_NAME } from "@/constants/app";
import { AuthMethod } from "@/types/AuthMethod";
import AuthMethodButton from "./AuthMethodButton.vue";

const emit = defineEmits<(e: "method-selected", method: AuthMethod, isSignIn: boolean) => void>();
const isSignIn = defineModel<boolean>("isSignIn", {
  default: true,
});
const currentMethod = ref<AuthMethod | undefined>(undefined);
const methodIcons: Record<AuthMethod, Component> = {
  [AuthMethod.TELEGRAM]: TelegramIcon,
};

const { t } = useI18n();

watch(currentMethod, (newMethod) => {
  if (!newMethod || !Object.keys(methodIcons).includes(newMethod)) {
    // TODO: Toast error message
    console.error("Invalid method:", newMethod);
    return;
  }

  emit("method-selected", newMethod, isSignIn.value);
});
</script>

<template>
  <n-card class="max-w-1/3 rounded-xl!">
    <div class="flex flex-col items-center justify-center space-y-4">
      <h1 class="mb-0">{{ APP_NAME }}</h1>
      <div v-if="isSignIn">{{ t("auth.sign-in.method") }}</div>
      <div v-else>{{ t("auth.sign-up.method") }}</div>
    </div>
    <div class="flex justify-center mt-6">
      <AuthMethodButton
        v-for="method in Object.values(AuthMethod)"
        :key="method"
        v-model="currentMethod"
        :method="method"
        :icon="methodIcons[method]"
      />
    </div>
    <small class="flex justify-center mt-4">
      <div class="space-x-1" v-if="isSignIn">
        <span>{{ t("auth.sign-in.notRegistered") }}</span>
        <n-button text size="tiny" @click="isSignIn = false">{{ t("auth.sign-up.sign-up") }}</n-button>
      </div>
      <div class="space-x-1" v-else>
        <span>{{ t("auth.sign-up.alreadyRegistered") }}</span>
        <n-button text size="tiny" @click="isSignIn = true">{{ t("auth.sign-in.sign-in") }}</n-button>
      </div>
    </small>
  </n-card>
</template>
