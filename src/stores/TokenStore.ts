import { defineStore } from "pinia";
import { ref } from "vue";
import { TokenPairSchema, type TokenPair } from "@/api/schemas/auth/common/TokenPair";
import type { JWT } from "@/api/schemas/common/JWT";

export const useTokenStore = defineStore("tokens", () => {
  const keys = {
    accessToken: "accessToken",
    refreshToken: "refreshToken",
  };

  const accessToken = ref<JWT | null>(null);
  const refreshToken = ref<JWT | null>(null);

  function updateTokens(tokenPair: TokenPair) {
    accessToken.value = tokenPair.accessToken;
    localStorage.setItem(keys.accessToken, accessToken.value);
    refreshToken.value = tokenPair.refreshToken;
    localStorage.setItem(keys.refreshToken, refreshToken.value);
  }

  function invalidate({ access = false, refresh = false } = {}) {
    if (access) accessToken.value = null;
    if (refresh) refreshToken.value = null;
  }

  function initialize() {
    accessToken.value = localStorage.getItem(keys.accessToken);
    refreshToken.value = localStorage.getItem(keys.refreshToken);
  }

  function $reset() {
    accessToken.value = null;
    refreshToken.value = null;
  }

  return { accessToken, refreshToken, updateTokens, invalidate, initialize, $reset };
});
