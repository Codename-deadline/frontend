import z from "zod";
import { OrganizationRoleSchema } from "./common/OrganizationRole";

export const OrganizationInvitationSchema = z.object({
  username: z.string(),
  role: OrganizationRoleSchema,
});

export type OrganizationInvitation = z.infer<typeof OrganizationInvitationSchema>;
