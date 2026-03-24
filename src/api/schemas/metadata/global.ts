import z from "zod";

export const GlobalMetadataSchema = z.object({
  rolesMetadataVersion: z.hash("sha256"),
});

export type GlobalMetadata = z.infer<typeof GlobalMetadataSchema>;
