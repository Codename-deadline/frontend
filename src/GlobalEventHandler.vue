<script setup lang="ts">
import { useNotification } from "naive-ui";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { getMe } from "./api/user";
import { useApi } from "./composables/useApi";
import emitter from "./plugins/emitter";
import { useTokenStore } from "./stores/TokenStore";
import { useUserStore } from "./stores/UserStore";
import { displayApiError, displayFormErrors } from "./utils";

const userStore = useUserStore();
const tokenStore = useTokenStore();
const { t } = useI18n();
const { makeRequest } = useApi();
const notification = useNotification();
const router = useRouter();

const fetchUser = async () => {
  if (!tokenStore.refreshToken) {
    router.push({ path: "/auth" });
    return;
  }

  const res = await makeRequest(() => getMe(), displayFormErrors, displayApiError);
  if (!res.ok) {
    notification.error({
      title: t("errors.critical-error"),
      content: `${t("errors.failed-to-fetch-user")}\n${t("actions.page-reload")}`,
      closable: true,
    });
    return;
  }

  userStore.setUser(res.data);
};
emitter.on("signUpCompleted", async () => {
  await fetchUser();
  router.push({ path: "/" });
});

const env = import.meta.env;
onMounted(async () => {
  if (userStore.isAvailable) return;
  await fetchUser();
});

emitter.on("failedToRefreshToken", () => {
  console.log("Failed to refresh token");
  if (env.VITE_NO_AUTH_REDIRECT?.toLowerCase() === "true") {
    console.warn("[DEV]: Auth redirect disabled");
    return;
  }
  userStore.$reset();
  router.push({ path: "/auth" });
});
</script>

<template></template>
