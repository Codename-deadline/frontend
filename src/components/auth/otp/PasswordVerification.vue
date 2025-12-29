<script setup lang="ts">
import { NForm, NFormItem, NInput } from "naive-ui";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import * as apiAuth from "@/api/auth";
import { useApi } from "@/composables/useApi";
import emitter from "@/plugins/emitter";
import type { AuthMethod } from "@/types/api";
import { displayApiError, displayFormErrors } from "@/utils";
import BaseAuthForm from "../common/BaseAuthForm.vue";
import { useTokenStore } from "@/stores/TokenStore";

// biome-ignore lint/correctness/noUnusedVariables: Biome does not yet check <template>
const { t } = useI18n();
const { makeRequest } = useApi();
const tokenStore = useTokenStore();

const props = defineProps<{
  requestId: string;
  authMethod: AuthMethod;
}>();
console.log(props.requestId);

const password = ref<string>("");

const _submit = async () => {
  const response = await makeRequest(
    () => apiAuth.verifyPassword({ id: props.requestId, password: password.value }),
    displayFormErrors,
    displayApiError,
  );
  if (!response.ok) return;

  tokenStore.updateTokens(response.data);
  emitter.emit("signUpCompleted");
};
</script>

<template>
  <BaseAuthForm
    @submit="_submit"
    :isSignIn="true"
    :authMethod="authMethod"
    button-selector="auth.password.action"
    header-selector="auth.password.header"
    description-selector="auth.password.description"
  >
    <n-form class="flex! justify-center!">
      <n-form-item :label="t('auth.password.fields.password')">
        <n-input v-model:value="password" type="password"/>
      </n-form-item>
    </n-form>
  </BaseAuthForm>
</template>
