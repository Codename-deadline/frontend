<script setup lang="ts">
import { NButton, NForm, NFormItem, NInputOtp } from "naive-ui";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import * as apiAuth from "@/api/auth";
import BaseAuthForm from "@/components/auth/BaseAuthForm.vue";
import { redirectToHome, storeTokenPair } from "@/utils";

// biome-ignore lint/correctness/noUnusedVariables: Biome does not yet check <template>
const { t } = useI18n();

const route = useRoute();
const otpId = route.query.otpId?.toString() || "";
if (!otpId) {
  redirectToHome();
}

const otp = ref<string[]>([]);
const _onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);

const _submit = async () => {
  console.log(otp.value);
  const result = await apiAuth.verifyOtp({ id: otpId, code: otp.value.join("") });
  if (!result) return;
  if (!result.ok) {
    console.error("Failed to sign up:", result.error);
    return;
  }

  if (result.data.passwordRequired) {
  } else {
    const tokenPair = result.data.tokenPair;
    // TODO: Proper error handling
    if (!tokenPair) {
      // This will only happen if the server returns an invalid response
      console.error("Token pair is missing");
      return;
    }
    storeTokenPair(tokenPair);
    redirectToHome();
  }
};
</script>

<template>
  <n-form>
    <n-form-item :label="t('auth.otp.label')">
      <n-input-otp v-model:value="otp" :allow-input="_onlyAllowNumber"/>
    </n-form-item>
    <div class="flex justify-center">
      <n-button type="info" @click="_submit">{{ t('auth.otp.verify') }}</n-button>
    </div>
  </n-form>
</template>
