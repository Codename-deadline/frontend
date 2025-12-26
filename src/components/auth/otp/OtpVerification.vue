<script setup lang="ts">
import { NButton, NForm, NFormItem, NInputOtp } from "naive-ui";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import * as apiAuth from "@/api/auth";
import { displayFormErrors, storeTokenPair, displayApiError } from "@/utils";
import { useApi as useApi } from "@/composables/useApi";

// biome-ignore lint/correctness/noUnusedVariables: Biome does not yet check <template>
const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const otpId = route.query.otpId?.toString() || "";
if (!otpId) {
  router.push({ path: "/" });
}

const { makeRequest } = useApi();

const otp = ref<string[]>([]);
const _onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);

const _submit = async () => {
  const otpCode: string = otp.value.join("");

  const result = await makeRequest(
    () => apiAuth.verifyOtp({ id: otpId, code: otpCode }),
    displayFormErrors,
    displayApiError,
  );
  if (!result.ok) return;

  if (result.data.passwordRequired) {
    // TODO: Request password
  } else {
    const tokenPair = result.data.tokenPair;
    // TODO: Proper error handling
    if (!tokenPair) {
      // This will only happen if the server returns an invalid response
      console.error("Token pair is missing");
      return;
    }
    storeTokenPair(tokenPair);
    router.push({ path: "/" });
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
