<script setup lang="ts">
import { toRef } from "@vueuse/core";
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

const signInData = ref<SignInRequest>({
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
  signInData.value.channel = authMethod.value.valueOf();

  const response = await makeRequest(() => apiAuth.signIn(signInData.value), displayFormErrors, displayApiError);
  if (!response.ok) return;

  redirectToOTP(router, response.data.otpId, authMethod.value);
};
</script>

<template>
  <BaseAuthForm
    @submit="_submit"
    :is-sign-in="true"
    :auth-method="authMethod"
    button-selector="auth.sign-in.action"
    header-selector="auth.sign-in.header"
    description-selector="auth.sign-in.description"
  >
    <n-form-item :label="t('auth.sign-in.fields.identifier.telegram')">
      <n-input v-model:value="signInData.identifier" :placeholder="t('auth.sign-in.fields.identifier.placeholder')"/>
    </n-form-item>
    <n-form-item :label="t('auth.sign-in.fields.username.label')">
      <n-input v-model:value="signInData.username" type="text" :placeholder="t('auth.sign-in.fields.username.placeholder')"/>
    </n-form-item>
  </BaseAuthForm>
</template>
