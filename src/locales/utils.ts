import type { OrganizationRole } from "@/api/schemas/organization/common/OrganizationRole";
import type { ScopeType } from "@/types/ScopeType";

export const extractRoleFromString = (scope: ScopeType, roleString: OrganizationRole) => {
  const roleSplit: string[] = roleString.toLowerCase().split('_');
  if (roleSplit.length !== 2) return "scopes.common.unknown"
  return `scopes.${scope}.role.${roleSplit[1]}`
}

export const tScopePrefix = (scope: ScopeType, suffix: string) => {
  return `scopes.${scope}.${suffix}`
}
