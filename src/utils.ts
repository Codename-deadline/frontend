import { useNotification } from "naive-ui";
import { useI18n } from "vue-i18n";
import type { TokenPair } from "@/api/schemas/auth/common/TokenPair";
import type { ApiError, FormErrors } from "./types/api";

export const storeTokenPair = (tokenPair: TokenPair) => {
  localStorage.setItem("accessToken", tokenPair.accessToken);
  localStorage.setItem("refreshToken", tokenPair.refreshToken);
};

export const displayFormErrors = (errors: FormErrors) => {
  const { t } = useI18n();
  const notification = useNotification();
  for (const [key, value] of Object.entries(errors)) {
    // TODO: Unhardcode "Error"
    notification.error({
      title: "Error",
      content: t(key, value),
      duration: 3500,
    });
  }
};

export const displayApiError = (error: ApiError) => {
  error;
  // TODO: Toast message.
};
