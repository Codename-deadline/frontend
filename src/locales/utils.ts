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

export const tEntity = (t: any, scope: ScopeType, action: string) => {
  return t(`scopes.toasts.entity-${action}`, {
    entity: t(`scopes.${scope}.name`),
  });
};
