import z from "zod";
import { IsoUtcDateSchema } from "./IsoUtcDate";
import { LanguageSchema } from "./LanguageSchema";

export const MinimalUserSchema = z.object({
  username: z.string(),
  fullName: z.string(),
});
export type MinimalUser = z.infer<typeof MinimalUserSchema>;

export const UserSchema = MinimalUserSchema.safeExtend({
  id: z.number(),
  joinedAt: IsoUtcDateSchema,
  language: LanguageSchema,
});
export type User = z.infer<typeof UserSchema>;
