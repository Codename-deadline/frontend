<script setup lang="ts">
import { Telegram as TelegramIcon } from "@vicons/fa";
import { NButton } from "naive-ui";
import { type Component, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import AuthCard from "@/components/auth/common/AuthCard.vue";
import AuthMethodButton from "@/components/auth/common/AuthMethodButton.vue";
import { AuthMethod } from "@/types/api";

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
  <AuthCard description-selector="auth.description">
    <template v-slot:body>
      <div class="flex justify-center mt-6">
        <AuthMethodButton
          v-for="method in Object.values(AuthMethod)"
          class="w-full! rounded-lg!"
          :key="method"
          v-model="currentMethod"
          :method="method"
          :icon="methodIcons[method]"
        />
      </div>
    </template>
    <template v-slot:footer>
      <small class="flex justify-center mt-8">
        <div class="space-x-1" v-if="isSignIn">
          <span>{{ t("auth.sign-in.notRegistered") }}</span>
          <n-button text size="tiny" @click="isSignIn = false">
            {{
            t("auth.sign-up.action")
          }}
          </n-button>
        </div>
        <div class="space-x-1" v-else>
          <span>{{ t("auth.sign-up.alreadyRegistered") }}</span>
          <n-button text tag="a" size="tiny" @click="isSignIn = true">
            {{
            t("auth.sign-in.action")
          }}
          </n-button>
        </div>
      </small>
    </template>
  </AuthCard>
</template>
