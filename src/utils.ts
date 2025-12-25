import { useRouter } from "vue-router";
import type { TokenPair } from "@/api/schemas/auth/common/TokenPair";

export const storeTokenPair = (tokenPair: TokenPair) => {
  localStorage.setItem("accessToken", tokenPair.accessToken);
  localStorage.setItem("refreshToken", tokenPair.refreshToken);
};

export const redirectToLogin = () => {
  const router = useRouter();
  router.push({ path: "/auth/" });
};

export const redirectToHome = () => {
  const router = useRouter();
  router.push({ path: "/" });
};
