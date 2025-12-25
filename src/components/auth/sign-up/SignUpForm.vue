<script setup lang="ts">
import { toRef } from "@vueuse/core";
// biome-ignore lint/correctness/noUnusedImports: Biome does not yet check <template>
import { NFormItem, NInput, NSelect } from "naive-ui";
import { type Ref, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import * as apiAuth from "@/api/auth";
import BaseAuthForm from "@/components/auth/BaseAuthForm.vue";
import { Language } from "@/types/Language";

const router = useRouter();
const { t } = useI18n();

const props = defineProps({
  method: {
    type: String,
    required: true,
  },
});
const authMethod: Ref<string> = toRef(props, "method");

const _registrationData = ref<{
  identifier: string;
  channel: string;
  username: string;
  fullName: string;
  language: Language;
}>({
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

const _submit = async () => {
  // TODO: Toast error message
  _registrationData.value.channel = authMethod.value.toUpperCase();

  const result = await apiAuth.signUp(_registrationData.value);
  // TODO: Proper error handling
  if (!result) return;
  if (!result.ok) {
    console.error("Failed to sign up:", result.error);
    return;
  }
  // TODO: Change language to selected
  router.push({
    path: "/auth/otp",
    query: {
      otpId: result.data.otpId,
    },
  });
};
</script>

<template>
  <BaseAuthForm @submit="_submit" :isSignIn="false">
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
