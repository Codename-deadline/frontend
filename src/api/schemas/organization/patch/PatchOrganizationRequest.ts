import z from "zod";

export const PatchOrganizationRequestSchema = z
  .object({
    title: z.string(),
    description: z.string(),
  })
  .partial();

export type PatchOrganizationRequest = z.infer<typeof PatchOrganizationRequestSchema>;
