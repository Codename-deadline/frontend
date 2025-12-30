import z from "zod";

export const OrganizationRoleSchema = z.enum(["ORG_MEMBER", "ORG_ADMIN", "ORG_OWNER"]);

export type OrganizationRole = z.infer<typeof OrganizationRoleSchema>;
