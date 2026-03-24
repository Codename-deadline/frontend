import type { OrganizationRole } from "@/api/schemas/organization/common/OrganizationRole";
import type { ScopeType } from "@/types/scope";

export const extractRoleFromString = (scope: ScopeType, roleString: OrganizationRole) => {
  const roleSplit: string[] = roleString.toLowerCase().split("_");
  if (roleSplit.length !== 2) return "scopes.common.unknown";
  return `scopes.${scope}.role.${roleSplit[1]}`;
};

// TODO: Remove tScopePrefix
export const tScopePrefix = (scope: ScopeType, suffix: string) => {
  return `scopes.${scope}.${suffix}`;
};

export const tActionConfirmation = (t: any, action: string) => {
  return t(`actions.confirmation`, {
    action: t(`actions.to-confirm.${action}`),
  });
};

export const tEntityActionConfirmation = (t: any, scope: ScopeType, action: string) => {
  const entity: string = t(`scopes.${scope}.name`);
  const actionToConfirm: string = t(`actions.to-confirm.${action}-entity`, { entity });
  return t("actions.confirmation", {
    action: actionToConfirm,
  });
};

export const tEntityToastAction = (t: any, scope: ScopeType, action: string) => {
  return t(`scopes.toasts.entity-${action}`, {
    entity: t(`scopes.${scope}.name`),
  });
};

export const tFormError = (t: any, field: string) => {
  return t(`scopes.common.form-errors.field-required`, {
    field: t(`scopes.common.form-labels.${field}`),
  });
};
