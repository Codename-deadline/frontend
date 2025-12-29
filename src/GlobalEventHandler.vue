<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import emitter from "./plugins/emitter";
import { useNotification } from "naive-ui";
import { useApi } from "./composables/useApi";
import { getMe } from "./api/user";
import { displayApiError, displayFormErrors } from "./utils";
import { useI18n } from "vue-i18n";
import { useUserStore } from "./stores/UserStore";
import { useTokenStore } from "./stores/TokenStore";

const userStore = useUserStore();
const tokenStore = useTokenStore();
const { t } = useI18n();
const { makeRequest } = useApi();
const notification = useNotification();
const router = useRouter();

const fetchUser = async () => {
  if (!tokenStore.refreshToken) {
    console.log("dsa");
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
  if (env.VITE_NO_AUTH_REDIRECT.toLowerCase() === "true") {
    console.warn("[DEV]: Auth redirect disabled");
    return;
  }
  userStore.$reset();
  router.push({ path: "/auth" });
});
</script>

<template></template>