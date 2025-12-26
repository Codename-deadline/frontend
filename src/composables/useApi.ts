import { useNotification } from "naive-ui";
import type { NotificationApiInjection } from "naive-ui/es/notification/src/NotificationProvider";
import { useI18n } from "vue-i18n";
import { parseZodError } from "@/api/utils";
import type { ApiError, FormErrors, SafeApiCall } from "@/types/api";
import type { OperationResult } from "@/types/OperationResult";

export function useApi() {
  const { t } = useI18n();
  const notification = useNotification();

  const makeRequest = async <T>(
    request: () => Promise<SafeApiCall<T>>,
    displayValidationError: (t: any, notification: NotificationApiInjection, error: FormErrors) => void,
    displayApiError: (t: any, notification: NotificationApiInjection, error: ApiError) => void,
  ): Promise<OperationResult<T>> => {
    const response = await request();

    if (!response.ok) {
      if (response.reason === "validation") {
        displayValidationError(t, notification, parseZodError(response.error));
      } else {
        displayApiError(t, notification, response.error);
      }
      return { ok: false };
    }

    return { ok: true, data: response.data };
  };

  return { makeRequest };
}
