import { useNotification } from "naive-ui";
import type { NotificationApiInjection } from "naive-ui/es/notification/src/NotificationProvider";
import { useI18n } from "vue-i18n";
import { parseZodError } from "@/api/utils";
import type { ApiError, FormErrors, SafeApiCall } from "@/types/api";
import type { OperationResult } from "@/types/OperationResult";
import { useRoute, useRouter, type Router } from "vue-router";
import { refreshToken as apiAuthRefreshToken } from "@/api/auth";
import { storeTokenPair } from "@/utils";

export function useApi() {
  const { t, te } = useI18n();
  const notification = useNotification();
  const route = useRoute();
  const router: Router = useRouter();
  const env = import.meta.env;

  const safeT = (key: string, options?: Record<string, unknown>) => {
    return te(key) ? t(key, options ?? {}) : undefined;
  };

  const shouldRefresh = (status?: number): boolean => {
    // 401 during sign-in/sign-up is returned for invalid credentials
    return status !== undefined && status === 401 && !route.path.includes("auth");
  };

  const refreshToken = async (): Promise<boolean> => {
    // client should already do this one error, but just in case
    localStorage.removeItem("accessToken");
    const refreshToken: string | null = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    const res = await apiAuthRefreshToken();
    if (!res.ok) return false;

    storeTokenPair(res.data);
    return true;
  };

  const makeRequest = async <T>(
    request: () => Promise<SafeApiCall<T>>,
    displayValidationError: (t: any, notification: NotificationApiInjection, error: FormErrors) => void,
    displayApiError: (t: any, notification: NotificationApiInjection, error: ApiError) => void,
  ): Promise<OperationResult<T>> => {
    const res = await request();
    if (res.ok) return { ok: true, data: res.data };

    if (res.reason === "validation") {
      displayValidationError(t, notification, parseZodError(res.error));
      return { ok: false };
    }
    if (!shouldRefresh(res.error.response?.status)) {
      displayApiError(safeT, notification, res.error);
      return { ok: false };
    }

    // TODO: Think about removing router usage from the useApi
    const success = await refreshToken();
    if (!success) {
      if (env.VITE_NO_AUTH_REDIRECT.toLowerCase() === "true") {
        console.warn("[DEV]: Auth redirect disabled");
        return { ok: false };
      }
      router.push({ path: "/auth" });
      return { ok: false };
    }

    // Try again with the new token
    return await makeRequest(request, displayValidationError, displayApiError);
  };

  return { makeRequest, refreshToken };
}
