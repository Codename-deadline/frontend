import z from "zod";
import { IsoUtcDateSchema } from "@/api/schemas/common/IsoUtcDate";
import { OrganizationStatsSchema } from "@/api/schemas/organization/common/OrganizationStats";
import { OrganizationTypeSchema } from "@/api/schemas/organization/common/OrganizationType";

export const OrganizationResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  type: OrganizationTypeSchema,
  createdAt: IsoUtcDateSchema,
  stats: OrganizationStatsSchema,
});

export type OrganizationResponse = z.infer<typeof OrganizationResponseSchema>;
