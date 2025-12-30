import z from "zod";
import { OrganizationTypeSchema } from "@/api/schemas/organization/common/OrganizationType";
import { InvitationSchema } from "../../invitation/Invitation";

export const CreateOrganizationRequestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: OrganizationTypeSchema,
  usersToInvite: z.array(InvitationSchema),
});

export type CreateOrganizationRequest = z.infer<typeof CreateOrganizationRequestSchema>;
