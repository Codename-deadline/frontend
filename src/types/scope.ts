import type { DeadlineRole } from "@/api/schemas/deadline/common/DeadlineRole";
import type { OrganizationRole } from "@/api/schemas/organization/common/OrganizationRole";
import type { ThreadRole } from "@/api/schemas/thread/common/ThreadRole";

export type ScopeType = "organization" | "thread" | "deadline";

export type AnyRole = OrganizationRole | ThreadRole | DeadlineRole;
