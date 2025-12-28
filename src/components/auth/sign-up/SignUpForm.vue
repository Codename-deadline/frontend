<script setup lang="ts">
import { toRef } from "@vueuse/core";
// biome-ignore lint/correctness/noUnusedImports: Biome does not yet check <template>
import { NFormItem, NInput, NSelect } from "naive-ui";
import { type Ref, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import * as apiAuth from "@/api/auth";
import type { SignUpRequest } from "@/api/schemas/auth/SignUpRequest";
import BaseAuthForm from "@/components/auth/common/BaseAuthForm.vue";
import { useApi } from "@/composables/useApi";
import type { AuthMethod } from "@/types/api";
import { Language } from "@/types/Language";
import { displayApiError, displayFormErrors, redirectToOTP } from "@/utils";

const router = useRouter();
const { t } = useI18n();

const props = defineProps<{
  method: AuthMethod;
}>();
const authMethod: Ref<AuthMethod> = toRef(() => props.method);

const _registrationData = ref<SignUpRequest>({
  identifier: "",
  channel: "",
  username: "",
  fullName: "",
  language: Language.ENGLISH,
});

const languageOptions: Array<{ label: string; value: Language }> = [];
Object.values(Language).forEach((language) => {
  languageOptions.push({
    label: t(`language.${language.toLowerCase()}`),
    value: language,
  });
});

const { makeRequest } = useApi();

const _submit = async () => {
  _registrationData.value.channel = authMethod.value.toUpperCase();

  const response = await makeRequest(() => apiAuth.signUp(_registrationData.value), displayFormErrors, displayApiError);
  if (!response.ok) return;

  redirectToOTP(router, response.data.otpId, authMethod.value);
};
</script>

<template>
  <BaseAuthForm
    @submit="_submit"
    :isSignIn="false"
    :authMethod="authMethod"
    buttonSelector="auth.sign-up.action"
    headerSelector="auth.sign-up.header"
    descriptionSelector="auth.sign-up.description"
  >
    <n-form-item :label="t(`auth.sign-up.fields.identifier.${authMethod.toLowerCase()}`)">
      <n-input v-model:value="_registrationData.identifier" placeholder="Enter your identifier" />
    </n-form-item>
    <n-form-item :label="t('auth.sign-up.fields.username')">
      <n-input
        v-model:value="_registrationData.username"
        type="text"
        placeholder="Enter your username"
      />
    </n-form-item>
    <n-form-item :label="t('auth.sign-up.fields.fullName')">
      <n-input
        v-model:value="_registrationData.fullName"
        type="text"
        placeholder="Enter your full name"
      />
    </n-form-item>
    <n-form-item :label="t('auth.sign-up.fields.language')">
      <n-select
        v-model:value="_registrationData.language"
        :options="languageOptions"
      />
    </n-form-item>
  </BaseAuthForm>
</template>
