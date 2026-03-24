import z from "zod";
import { paginationResponseSchema as pagedResponseSchema } from "@/api/common/PaginationResponse";
import { IsoUtcDateSchema } from "@/api/schemas/common/IsoUtcDate";
import { OrganizationStatsSchema } from "@/api/schemas/organization/common/OrganizationStats";
import { OrganizationTypeSchema } from "@/api/schemas/organization/common/OrganizationType";
import { OrganizationPermissionsSchema } from "./OrganizationPermissions";
import { OrganizationRoleSchema } from "./OrganizationRole";

export const OrganizationSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  type: OrganizationTypeSchema,
  createdAt: IsoUtcDateSchema,
  stats: OrganizationStatsSchema,
  permissions: OrganizationPermissionsSchema,
});

export const PagedOrganizationSchema = pagedResponseSchema(OrganizationSchema);
export type Organization = z.infer<typeof OrganizationSchema>;
export type PagedOrganization = z.infer<typeof PagedOrganizationSchema>;

export const OrganizationWithRoleSchema = OrganizationSchema.extend({
  role: OrganizationRoleSchema,
});

export const PagedOrganizationWithRoleSchema = pagedResponseSchema(OrganizationWithRoleSchema);
export type OrganizationWithRole = z.infer<typeof OrganizationWithRoleSchema>;
export type PagedOrganizationWithRole = z.infer<typeof PagedOrganizationWithRoleSchema>;
