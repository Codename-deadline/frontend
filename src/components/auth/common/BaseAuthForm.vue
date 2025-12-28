<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedImports: Biome does not yet check <template>
import { NButton, NForm } from "naive-ui";
import { capitalize } from "vue";
import { useI18n } from "vue-i18n";
import emitter from "@/plugins/emitter";
import type { AuthMethod } from "@/types/api";
import AuthCard from "./AuthCard.vue";

const { t } = useI18n();
const emit = defineEmits<(e: "submit") => void>();
const props = defineProps<{
  buttonSelector: string;
  headerSelector: string;
  descriptionSelector: string;
  isSignIn: boolean;
  authMethod: AuthMethod;
}>();

const _resetAuthProcess = () => {
  emitter.emit("resetAuthProgress");
};
</script>

<template>
  <auth-card
    @back="_resetAuthProcess"
    :show-back-button="true"
    :header-selector="headerSelector"
    :description-selector="descriptionSelector"
  >
    <template v-slot:body>
      <n-form>
        <slot/>
      </n-form>
    </template>
    <template v-slot:footer>
      <div class="flex flex-col items-center">
        <n-button type="info" class="w-full! rounded-lg!" @click="emit('submit')">{{ t(buttonSelector) }}</n-button>
        <small class="mt-5 text-gray-500">
          {{ t("auth.method") }}
          {{ capitalize(authMethod.valueOf().toLowerCase()) }}
        </small>
      </div>
    </template>
  </auth-card>
</template>
