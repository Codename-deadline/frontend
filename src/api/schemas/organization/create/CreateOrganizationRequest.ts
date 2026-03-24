import z from "zod";
import { OrganizationTypeSchema } from "@/api/schemas/organization/common/OrganizationType";
import { OrganizationInvitationSchema } from "../Invitation";

export const CreateOrganizationRequestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: OrganizationTypeSchema,
  invitations: z.array(OrganizationInvitationSchema),
});

export type CreateOrganizationRequest = z.infer<typeof CreateOrganizationRequestSchema>;
