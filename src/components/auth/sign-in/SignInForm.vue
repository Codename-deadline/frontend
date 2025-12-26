<script setup lang="ts">
import { toRef } from "@vueuse/core";
// biome-ignore lint/correctness/noUnusedImports: Biome does not yet check <template>
import { NFormItem, NInput } from "naive-ui";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import BaseAuthForm from "@/components/auth/BaseAuthForm.vue";
import { Language } from "@/types/Language";

const { t } = useI18n();
const router = useRouter();

const props = defineProps<{
  method: string;
}>();
const authMethod = toRef(props, "method");

const _signInData = ref({
  identifier: "",
  channel: "",
  username: "",
});

const languageOptions: Array<{ label: string; value: Language }> = [];
Object.values(Language).forEach((language) => {
  languageOptions.push({
    label: t(`language.${language}`),
    value: language,
  });
});

const _submit = () => {
  _signInData.value.channel = authMethod.value as string;
  const otpId = "test";
  router.push({
    path: "/auth/otp",
    query: {
      id: otpId,
    },
  });
  // TODO: Implement form submission logic
};
</script>

<template>
  <BaseAuthForm @submit="_submit" :isSignIn="true">
    <n-form-item :label="t('auth.sign-up.fields.identifier.telegram')">
      <n-input v-model:value="_signInData.identifier" placeholder="Enter your identifier" />
    </n-form-item>
    <n-form-item :label="t('auth.sign-up.fields.username')">
      <n-input
        v-model:value="_signInData.username"
        type="text"
        placeholder="Enter your username"
      />
    </n-form-item>
  </BaseAuthForm>
</template>
