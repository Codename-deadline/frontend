<script setup lang="ts">
import { useNotification } from "naive-ui";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { getApplicationMetadataVersions } from "./api/metadata";
import { getRolesMetadata } from "./api/roles";
import { getMe } from "./api/user";
import { useApi } from "./composables/useApi";
import emitter from "./plugins/emitter";
import { useMetadataStore } from "./stores/MetadataStore";
import { useTokenStore } from "./stores/TokenStore";
import { useUserStore } from "./stores/UserStore";
import { displayApiError, displayFormErrors } from "./utils";

const userStore = useUserStore();
const tokenStore = useTokenStore();
const { t } = useI18n();
const { makeRequest } = useApi();
const notification = useNotification();
const router = useRouter();

const displayCriticalError = (errorSelector: string) => {
  notification.error({
    title: t("errors.critical-error"),
    content: `${t(`errors.${errorSelector}`)}\n${t("actions.page-reload")}`,
    closable: true,
  });
};

const fetchUser = async () => {
  if (!tokenStore.refreshToken) {
    router.push({ path: "/auth" });
    return;
  }

  const res = await makeRequest(() => getMe(), displayFormErrors, displayApiError);
  if (!res.ok) {
    displayCriticalError("failed-to-fetch-user");
    return;
  }

  userStore.setUser(res.data);
};
emitter.on("signUpCompleted", async () => {
  await fetchUser();
  router.push({ path: "/" });
});

const refetchOutdatedMetadata = async () => {
  const metadataStore = useMetadataStore();

  const res = await makeRequest(() => getApplicationMetadataVersions(), displayFormErrors, displayApiError);
  if (!res.ok) {
    displayCriticalError("failed-to-fetch-metadata-versions");
    return;
  }
  const { rolesMetadataVersion } = res.data;

  if (metadataStore.metadata.roles?.version !== rolesMetadataVersion) {
    const rolesRes = await makeRequest(() => getRolesMetadata(), displayFormErrors, displayApiError);
    if (!rolesRes.ok) {
      displayCriticalError("failed-to-fetch-metadata");
      return;
    }
    metadataStore.updateRoles(rolesRes.data, rolesMetadataVersion);
  }
};


onMounted(async () => {
  await refetchOutdatedMetadata();
  if (userStore.isAvailable) return;
  await fetchUser();
});

const env = import.meta.env;
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
