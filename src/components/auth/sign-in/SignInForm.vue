<script setup lang="ts">
import { toRef } from "@vueuse/core";
// biome-ignore lint/correctness/noUnusedImports: Biome does not yet check <template>
import { NFormItem, NInput } from "naive-ui";
import { type Ref, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import * as apiAuth from "@/api/auth";
import type { SignInRequest } from "@/api/schemas/auth/SignInRequest";
import BaseAuthForm from "@/components/auth/common/BaseAuthForm.vue";
import { useApi } from "@/composables/useApi";
import type { AuthMethod } from "@/types/api";
import { Language } from "@/types/Language";
import { displayApiError, displayFormErrors, redirectToOTP } from "@/utils";

const { t } = useI18n();
const router = useRouter();
const { makeRequest } = useApi();

const props = defineProps<{
  method: AuthMethod;
}>();
const authMethod: Ref<AuthMethod> = toRef(() => props.method);

const _signInData = ref<SignInRequest>({
  identifier: "",
  channel: "",
  username: "",
});

const languageOptions: Array<{ label: string; value: Language }> = [];
Object.values(Language).forEach((language) => {
  languageOptions.push({
    label: t(`language.${language.valueOf().toLowerCase()}`),
    value: language,
  });
});

const _submit = async () => {
  _signInData.value.channel = authMethod.value.valueOf();

  const response = await makeRequest(() => apiAuth.signIn(_signInData.value), displayFormErrors, displayApiError);
  if (!response.ok) return;

  redirectToOTP(router, response.data.otpId, authMethod.value);
};
</script>

<template>
  <BaseAuthForm
    @submit="_submit"
    :isSignIn="true"
    :authMethod="authMethod"
    buttonSelector="auth.sign-in.action"
    headerSelector="auth.sign-in.header"
    descriptionSelector="auth.sign-in.description"
  >
    <n-form-item :label="t('auth.sign-in.fields.identifier.telegram')">
      <n-input v-model:value="_signInData.identifier" placeholder="Enter your identifier"/>
    </n-form-item>
    <n-form-item :label="t('auth.sign-in.fields.username')">
      <n-input v-model:value="_signInData.username" type="text" placeholder="Enter your username"/>
    </n-form-item>
  </BaseAuthForm>
</template>
