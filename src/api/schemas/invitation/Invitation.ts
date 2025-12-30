import z from "zod";
import { OrganizationRoleSchema } from "../organization/common/OrganizationRole";

export const InvitationSchema = z.object({
  username: z.string(),
  role: OrganizationRoleSchema,
});

export type Invitation = z.infer<typeof InvitationSchema>;
