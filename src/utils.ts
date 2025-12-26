import type { NotificationApiInjection } from "naive-ui/es/notification/src/NotificationProvider";
import { capitalize } from "vue";
import type { Router } from "vue-router";
import type { TokenPair } from "@/api/schemas/auth/common/TokenPair";
import type { ApiError, AuthMethod, FieldError, FormErrors } from "./types/api";

export const storeTokenPair = (tokenPair: TokenPair) => {
  localStorage.setItem("accessToken", tokenPair.accessToken);
  localStorage.setItem("refreshToken", tokenPair.refreshToken);
};

export const redirectToOTP = (router: Router, otpId: string, authMethod: AuthMethod) => {
  router.push({
    path: "/auth/otp",
    query: {
      id: otpId,
      method: authMethod,
    },
  });
};

export const displayFormErrors = (t: any, notification: NotificationApiInjection, errors: FormErrors) => {
  const buildRow = (index: number, error: FieldError) => {
    const params = {
      field: capitalize(error.field),
      ...(error.params ?? {}),
    };
    return `${index}. ${t(`errors.form.${error.code.replace("_", "-")}`, params)}\n`;
  };

  let notificationBody: string = "";
  errors.forEach((error, index) => {
    notificationBody += buildRow(index + 1, error);
  });

  notification.error({
    title: t("errors.form.invalid-input"),
    content: notificationBody,
    duration: 5000,
  });
};

export const displayApiError = (t: any, notification: NotificationApiInjection, error: ApiError) => {
  // TODO: Display api error.
  error;
  t;
  notification;
};
