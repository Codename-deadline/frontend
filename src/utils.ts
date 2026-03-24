import type { NotificationApiInjection } from "naive-ui/es/notification/src/NotificationProvider";
import { capitalize, type InjectionKey, inject } from "vue";
import type { Router } from "vue-router";
import { GeneralErrorSchema } from "@/api/common/GeneralError";
import { DeadlineRoleSchema } from "./api/schemas/deadline/common/DeadlineRole";
import { OrganizationRoleSchema } from "./api/schemas/organization/common/OrganizationRole";
import { ThreadRoleSchema } from "./api/schemas/thread/common/ThreadRole";
import type { ApiError, AuthMethod, FieldError, FormErrors } from "./types/api";
import type { ScopeType } from "./types/scope";

export const redirectToOTP = (router: Router, otpId: string, authMethod: AuthMethod) => {
  router.push({
    path: "/auth/otp",
    query: {
      id: otpId,
      method: authMethod,
    },
  });
};

export const isRoleInScope = (role: string, scopeType: ScopeType): boolean => {
  switch (scopeType) {
    case "organization":
      return OrganizationRoleSchema.safeParse(role).success;
    case "thread":
      return ThreadRoleSchema.safeParse(role).success;
    case "deadline":
      return DeadlineRoleSchema.safeParse(role).success;
  }
};

export const displayFormErrors = (t: any, notification: NotificationApiInjection, errors: FormErrors) => {
  const buildRow = (index: number, error: FieldError) => {
    const params = {
      field: capitalize(error.field),
      ...(error.params ?? {}),
    };
    // TODO: errors.form.invalid-type
    return `${index}. ${t(`errors.form.${error.code.replace("_", "-")}`, params)}\n`;
  };

  let notificationBody: string = "";
  errors.forEach((error, index) => {
    notificationBody += buildRow(index + 1, error);
  });
  console.error(errors);

  notification.error({
    title: t("errors.form.invalid-input"),
    content: notificationBody,
    duration: 5000,
  });
};

export const displayApiError = (safeT: any, notification: NotificationApiInjection, error: ApiError) => {
  const apiError = error.error;

  let errorMessageContent: string | null = null;

  switch (apiError.name) {
    case "HttpError": {
      const parsed = GeneralErrorSchema.safeParse(apiError.body);
      if (!parsed.success) {
        console.error("Failed to display error data");
        break;
      }
      console.error(parsed.data);
      errorMessageContent = safeT(`errors.api.${parsed.data.code}`, parsed.data.params ?? {});
      break;
    }
    case "NetworkError": {
      errorMessageContent = safeT("errors.api.no-network");
      break;
    }
    case "TimeoutError": {
      errorMessageContent = safeT("errors.api.timeout");
      break;
    }
    case "ValidationError": {
      console.error("Failed to parse response body");
      break;
    }
  }

  notification.error({
    title: safeT("errors.error"),
    content: errorMessageContent ?? safeT("errors.unknown-error"),
    duration: 3500,
  });
};

export const injectOrThrow = <T>(key: InjectionKey<T>): T => {
  const value = inject(key);
  if (!value) {
    throw new Error(`injectOrThrow: Unable to inject value for key ${String(key)}`);
  }
  return value;
};
